import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Match } from './matches.model';
import { CreateMatchDto } from './dto/create-match.dto';
import { TeamsService } from '../teams/teams.service';
import { EventsService } from '../events/events.service';
import { ScoresService } from '../scores/scores.service';
import HLTV from 'hltv-api19028309';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel(Match) private matchesRepository: typeof Match,
    private readonly httpService: HttpService,
    private teamsService: TeamsService,
    private eventsService: EventsService,
    private scoreService: ScoresService,
  ) {}

  async getAll() {
    const matches = await this.matchesRepository.findAll({
      include: { all: true },
    });

    const response = matches.map(async (match) => {
      const { id, date, picks, matchType, meta, status } = match;
      const {
        name: team1Name,
        logo: team1Logo,
        country: team1Country,
      } = match.teams[0];
      const {
        name: team2Name,
        logo: team2Logo,
        country: team2Country,
      } = match.teams[1];
      const { name: eventName, logo: eventLogo, live } = match.event;

      const score = await this.scoreService.getScoreById(match.scoreId);
      const { team1Score, team2Score } = score;

      const maps = score.maps
        .map((item) => {
          return {
            team1: {
              totalScore: item.team1MapScore,
              tSideScore: item.team1TScore,
              ctSideScore: item.team1CTScore,
            },
            team2: {
              totalScore: item.team2MapScore,
              tSideScore: item.team2TScore,
              ctSideScore: item.team2CTScore,
            },
            name: item.name,
            pickedBy: item.pickedBy,
            number: item.number,
          };
        })
        .sort((a, b) => a.number - b.number);

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
        },
        picks,
        matchType,
        matchEvent: {
          name: eventName,
          logo: eventLogo,
          live,
        },
        meta,
        status,
      };
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
          name: parsedMatch.event.name,
          logo:
            parsedMatch.event.logo ||
            'https://www.hltv.org/img/static/team/placeholder.svg',
          live: 'https://player.twitch.tv/?channel=esl_csgo&parent=localhost',
        },
        meta: parsedMatch.meta,
        status: parsedMatch.matchStatus,
        matchType: parsedMatch.matchType,
        picks: parsedMatch.picks,
      };

      await this.createMatch(dto);

      match = await this.matchesRepository.findOne({
        where: { id: matchId },
        include: { all: true },
      });
    }

    const { id, date, picks, matchType, meta, status, team1Name, team2Name } =
      match;

    const { logo: team1Logo, country: team1Country } = match.teams.find(
      (team) => team.name === team1Name,
    );
    const { logo: team2Logo, country: team2Country } = match.teams.find(
      (team) => team.name === team2Name,
    );

    const { name: eventName, logo: eventLogo, live } = match.event;

    const score = await this.scoreService.getScoreById(match.scoreId);
    const { team1Score, team2Score, firstPick } = score;

    const maps = score.maps
      .map((item) => {
        return {
          team1: {
            totalScore: item.team1MapScore,
            tSideScore: item.team1TScore,
            ctSideScore: item.team1CTScore,
          },
          team2: {
            totalScore: item.team2MapScore,
            tSideScore: item.team2TScore,
            ctSideScore: item.team2CTScore,
          },
          name: item.name,
          pickedBy: item.pickedBy,
          number: item.number,
        };
      })
      .sort((a, b) => a.number - b.number);

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
        live,
      },
      meta,
      status,
    };
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
}
