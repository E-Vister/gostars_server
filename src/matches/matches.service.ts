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

@Injectable()
export class MatchesService {
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
    let match = await this.matchesRepository.findOne({
      where: { id: matchId },
      include: { all: true },
    });

    if (match === null) {
      const parsedMatch = await HLTV.getMatchById(Number(matchId));

      const dto: CreateMatchDto = {
        id: parsedMatch.id,
        date: new Date(Date.parse(parsedMatch.time)),
        team1: parsedMatch.team1,
        team2: parsedMatch.team2,
        score: {
          main: parsedMatch.score.main,
          maps: parsedMatch.score.maps.map((m) => {
            return {
              team1: {
                totalScore: m.team1.totalScore,
                tSideScore:
                  m.team1.first.side === 't'
                    ? m.team1.first.rounds
                    : m.team1.second.rounds,
                ctSideScore:
                  m.team1.first.side === 'ct'
                    ? m.team1.first.rounds
                    : m.team1.second.rounds,
              },
              team2: {
                totalScore: m.team2.totalScore,
                tSideScore:
                  m.team2.first.side === 't'
                    ? m.team2.first.rounds
                    : m.team2.second.rounds,
                ctSideScore:
                  m.team2.first.side === 'ct'
                    ? m.team2.first.rounds
                    : m.team2.second.rounds,
              },
              name: m.name,
              pickedBy:
                m.pickedBy === 'decider'
                  ? 'decider'
                  : m.pickedBy === parsedMatch.team1.name
                  ? 'team1'
                  : 'team2',
              number: m.number,
            };
          }),
          firstPick: parsedMatch.score.firstPick,
        },
        matchEvent: {
          id: +parsedMatch.event.id,
          name: parsedMatch.event.name,
          logo:
            parsedMatch.event.logo ||
            'https://www.hltv.org/img/static/team/placeholder.svg',
        },
        meta: parsedMatch.meta,
        status: parsedMatch.matchStatus,
        matchType: parsedMatch.matchType,
        picks: parsedMatch.picks,
        stream: parsedMatch.stream,
      };

      await this.createMatch(dto);

      match = await this.matchesRepository.findOne({
        where: { id: matchId },
        include: { all: true },
      });
    }

    return await this.matchResponse(match);
  }

  async createMatch(dto: CreateMatchDto) {
    const match = await this.matchesRepository.create({
      ...dto,
      team1Name: dto.team1.name,
      team2Name: dto.team2.name,
    });

    const team1 = await this.teamsService.cacheTeam(dto.team1);

    const team2 = await this.teamsService.cacheTeam(dto.team2);

    const event = await this.eventsService.cacheEvent(dto.matchEvent);

    const score = await this.scoreService.cacheScore(dto.score);

    if (match && event && team1 && team2 && score) {
      await match.$set('teams', [team1.id, team2.id]);
      await match.$set('event', event.id);
      await match.$set('score', score.id);

      return match;
    } else {
      return { error: 'Some properties are missing' };
    }
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
    const results = await HLTV.getResults(offset);

    const matchesId = results.map((result) => result.matchId);

    const dbMatchesId = await this.matchesRepository
      .findAll({
        attributes: ['id'],
      })
      .then((res) => res.map((match) => match.id));

    const responseResults = [];

    for (const matchId of matchesId) {
      let result, dbResult;

      if (dbMatchesId.includes(matchId)) {
        dbResult = await this.matchesRepository.findOne({
          where: { id: matchId },
          include: { all: true },
        });
      }

      if (dbResult && dbResult.status === 'ended') {
        const { date, team1, team2, matchEvent, matchType, score, id, meta } =
          await this.matchResponse(dbResult);

        responseResults.push({
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
        const matchIndex = matchesId.indexOf(matchId);
        result = results[matchIndex];

        responseResults.push({
          date: result.time,
          team1: {
            name: result.team1.name,
            logo: result.team1.logo,
          },
          team2: {
            name: result.team2.name,
            logo: result.team2.logo,
          },
          matchEvent: result.event,
          matchType: '',
          score: {
            main: {
              team1: result.team1.result,
              team2: result.team2.result,
            },
            maps: [],
          },
          meta: result.meta,
          id: result.matchId,
        });
      }
    }

    return responseResults;
  }

  async getUpcomingMatches() {
    const matches = await HLTV.getMatches();

    const matchesId = matches.map((match) => match.id);
    const dbMatchesId = await this.matchesRepository
      .findAll({
        attributes: ['id'],
      })
      .then((res) => res.map((match) => match.id));

    const responseUpcoming = [];

    for (const matchId of matchesId) {
      let match;

      if (dbMatchesId.includes(matchId)) {
        const dbMatch = await this.matchesRepository.findOne({
          where: { id: matchId },
          include: { all: true },
        });

        const { date, team1, team2, matchEvent, matchType, id, meta } =
          await this.matchResponse(dbMatch);

        responseUpcoming.push({
          date,
          team1,
          team2,
          matchEvent,
          matchType,
          meta,
          id,
        });
      } else {
        const matchIndex = matchesId.indexOf(matchId);
        match = matches[matchIndex];

        responseUpcoming.push({
          date: match.time,
          team1: {
            name: match.team1.name,
            logo: match.team1.logo,
          },
          team2: {
            name: match.team2.name,
            logo: match.team2.logo,
          },
          matchEvent: match.event,
          matchType: '',
          meta: match.maps,
          id: match.id,
        });
      }
    }

    return responseUpcoming;
  }

  async matchResponse(match) {
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
    } = match;

    const { logo: team1Logo, country: team1Country } = match.teams.find(
      (team) => team.name === team1Name,
    );
    const { logo: team2Logo, country: team2Country } = match.teams.find(
      (team) => team.name === team2Name,
    );

    const { name: eventName, logo: eventLogo, id: eventId } = match.event;

    const score = await this.scoreService.getScoreById(match.scoreId);
    const { team1Score, team2Score, firstPick } = score;

    const maps = await this.mapsService.responseMaps(score.maps);

    return {
      id,
      date,
      team1: {
        name: team1Name,
        logo: team1Logo,
        country: team1Country,
      },
      team2: {
        name: team2Name,
        logo: team2Logo,
        country: team2Country,
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
        name: eventName,
        logo: eventLogo,
        id: eventId,
      },
      meta,
      status,
      stream,
    };
  }
}
