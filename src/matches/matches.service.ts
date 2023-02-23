import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Match } from './matches.model';
import { CreateMatchDto } from './dto/create-match.dto';
import { TeamsService } from '../teams/teams.service';
import { EventsService } from '../events/events.service';
import { ScoresService } from '../scores/scores.service';
import HLTV from 'hltv-api19028309';
import { HttpService } from '@nestjs/axios';
import { MapsService } from '../maps/maps.service';
import { CreateMapDto } from '../maps/dto/create-map.dto';

@Injectable()
export class MatchesService {
  private readonly MAX_MATCHES = 50;

  constructor(
    @InjectModel(Match) private matchesRepository: typeof Match,
    private readonly httpService: HttpService,
    private teamsService: TeamsService,
    private eventsService: EventsService,
    private mapsService: MapsService,
    private scoreService: ScoresService,
  ) {}

  async getAll() {
    const matches = await this.matchesRepository.findAll({
      include: { all: true },
    });

    const response = matches.map(async (match) => {
      return await this.matchResponse(match);
    });

    return await Promise.all(response);
  }

  async getMatchById(matchId: string) {
    const match = await this.matchesRepository.findOne({
      where: { id: matchId },
      include: { all: true },
    });

    if (match) {
      return await this.matchResponse(match);
    }

    const {
      event: { id: eventId, logo, name },
      id,
      matchStatus,
      matchType,
      meta,
      picks,
      score: { firstPick, main, maps: parsedMaps },
      stream,
      team1,
      team2,
      time,
    } = await HLTV.getMatchById(Number(matchId));

    const maps: CreateMapDto[] = parsedMaps.map((m) => {
      const team1First = m.team1.first;
      const team1Second = m.team1.second;
      const team2First = m.team2.first;
      const team2Second = m.team2.second;
      const team1TSideScore =
        team1First.side === 't' ? team1First.rounds : team1Second.rounds;
      const team1CTSideScore =
        team1First.side === 'ct' ? team1First.rounds : team1Second.rounds;
      const team2TSideScore =
        team2First.side === 't' ? team2First.rounds : team2Second.rounds;
      const team2CTSideScore =
        team2First.side === 'ct' ? team2First.rounds : team2Second.rounds;

      return {
        team1: {
          totalScore: m.team1.totalScore,
          tSideScore: team1TSideScore,
          ctSideScore: team1CTSideScore,
        },
        team2: {
          totalScore: m.team2.totalScore,
          tSideScore: team2TSideScore,
          ctSideScore: team2CTSideScore,
        },
        name: m.name,
        pickedBy:
          m.pickedBy === 'decider'
            ? 'decider'
            : m.pickedBy === team1.name
            ? 'team1'
            : 'team2',
        number: m.number,
      };
    });

    const dto: CreateMatchDto = {
      id,
      date: new Date(Date.parse(time)),
      team1,
      team2,
      score: {
        main,
        maps,
        firstPick,
      },
      matchEvent: {
        id: +eventId,
        name,
        logo: logo || 'https://www.hltv.org/img/static/team/placeholder.svg',
      },
      meta,
      status: matchStatus,
      matchType,
      picks,
      stream,
    };

    await this.createMatch(dto);
    const newMatch = await this.matchesRepository.findOne({
      where: { id: dto.id },
      include: { all: true },
    });

    return await this.matchResponse(newMatch as Match);
  }

  async createMatch(dto: CreateMatchDto) {
    const { name: team1Name } = dto.team1;
    const { name: team2Name } = dto.team2;

    const [team1, team2, event, score] = await Promise.all([
      this.teamsService.cacheTeam(dto.team1),
      this.teamsService.cacheTeam(dto.team2),
      this.eventsService.cacheEvent(dto.matchEvent),
      this.scoreService.cacheScore(dto.score),
    ]);

    if (!team1 || !team2 || !event || !score) {
      return { error: 'Some properties are missing' };
    }

    const match = await this.matchesRepository.create({
      ...dto,
      team1Name,
      team2Name,
    });

    await match.$set('teams', [team1.id, team2.id]);
    await match.$set('event', event.id);
    await match.$set('score', score.id);

    return match;
  }

  async removeMatchById(matchId: string) {
    const match = await this.matchesRepository.findOne({
      where: { id: matchId },
    });

    if (!match) {
      return { code: 201 };
    }

    if (match.scoreId) {
      await this.scoreService.removeScoreById(match.scoreId.toString());
    }

    await this.matchesRepository.destroy({
      where: { id: matchId },
    });

    return { code: 200 };
  }

  async getEndedMatches(offset: number) {
    const [results, dbMatches] = await Promise.all([
      HLTV.getResults(offset),
      this.matchesRepository.findAll({
        attributes: ['id'],
      }),
    ]);

    const matchesIds = results.map((match) => match.matchId);
    const dbMatchesIds = dbMatches.map((match) => match.id);
    const endedMatches = [];

    for (const matchId of matchesIds.slice(0, this.MAX_MATCHES)) {
      let dbResult;

      if (dbMatchesIds.includes(matchId)) {
        dbResult = await this.matchesRepository.findOne({
          where: { id: matchId },
          include: { all: true },
        });
      }

      if (dbResult && dbResult.status === 'ended') {
        const { date, team1, team2, matchEvent, matchType, score, id, meta } =
          await this.matchResponse(dbResult);

        endedMatches.push({
          date,
          team1,
          team2,
          matchEvent,
          matchType,
          score,
          meta,
          id,
        });
      } else {
        await this.removeMatchById(matchId.toString());
        const matchIndex = matchesIds.indexOf(matchId);
        const {
          team1,
          team2,
          event,
          meta,
          matchId: resultMatchId,
          time,
        } = results[matchIndex];

        endedMatches.push({
          date: time,
          team1: {
            name: team1.name,
            logo: team1.logo,
          },
          team2: {
            name: team2.name,
            logo: team2.logo,
          },
          matchEvent: event,
          matchType: '',
          score: {
            main: {
              team1: team1.result,
              team2: team2.result,
            },
            maps: [],
          },
          meta: meta,
          id: resultMatchId,
        });
      }
    }

    return endedMatches;
  }

  async getUpcomingMatches() {
    const [matches, dbMatches] = await Promise.all([
      HLTV.getMatches(),
      this.matchesRepository.findAll({
        attributes: ['id'],
      }),
    ]);
    const matchesIds = matches.map((match) => match.id);
    const dbMatchesIds = dbMatches.map((match) => match.id);
    const upcomingMatches = [];

    for (const matchId of matchesIds.slice(0, this.MAX_MATCHES)) {
      if (dbMatchesIds.includes(matchId)) {
        const dbMatch = await this.matchesRepository.findOne({
          where: { id: matchId },
          include: { all: true },
        });

        const { date, team1, team2, matchEvent, matchType, id, meta } =
          await this.matchResponse(dbMatch);

        upcomingMatches.push({
          date,
          team1,
          team2,
          matchEvent,
          matchType,
          meta,
          id,
        });
      } else {
        const matchIndex = matchesIds.indexOf(matchId);
        const { team1, team2, event, maps, id, time } = matches[matchIndex];

        upcomingMatches.push({
          date: time,
          team1,
          team2,
          matchEvent: event,
          matchType: '',
          meta: maps,
          id,
        });
      }
    }

    return upcomingMatches;
  }

  async matchResponse(match: Match) {
    const {
      id,
      date,
      picks,
      matchType,
      meta,
      status,
      team1Name,
      team2Name,
      stream,
      teams,
      event,
      scoreId,
    } = match;

    const team1 = teams.find((team) => team.name === team1Name);
    const team2 = teams.find((team) => team.name === team2Name);

    const score = await this.scoreService.getScoreById(scoreId);
    const { team1Score, team2Score, firstPick } = score;

    const maps = await this.mapsService.responseMaps(score.maps);

    return {
      id,
      date,
      team1: {
        name: team1Name,
        logo: team1.logo,
        country: team1.country,
      },
      team2: {
        name: team2Name,
        logo: team2.logo,
        country: team2.country,
      },
      score: {
        main: {
          team1: team1Score,
          team2: team2Score,
        },
        maps,
        firstPick,
      },
      picks,
      matchType,
      matchEvent: {
        name: event.name,
        logo: event.logo,
        id: event.id,
      },
      meta,
      status,
      stream,
    };
  }
}
