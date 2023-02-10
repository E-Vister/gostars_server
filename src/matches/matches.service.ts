import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Match } from './matches.model';
import { CreateMatchDto } from './dto/create-match.dto';
import { TeamsService } from '../teams/teams.service';
import { EventsService } from '../events/events.service';
import { ScoresService } from '../scores/scores.service';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel(Match) private matchesRepository: typeof Match,
    private teamsService: TeamsService,
    private eventsService: EventsService,
    private scoreService: ScoresService,
  ) {}

  async getAll() {
    const matches = await this.matchesRepository.findAll({
      include: { all: true },
    });

    const response = matches.map(async (match) => {
      const { id, time, picks, matchType, meta, status } = match;
      const { name: team1Name, logo: team1Logo } = match.teams[0];
      const { name: team2Name, logo: team2Logo } = match.teams[1];
      const { name: eventName, logo: eventLogo } = match.event;

      const score = await this.scoreService.getScoreById(match.scoreId);
      const { team1Score, team2Score } = score;

      const maps = score.maps.map((item) => {
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
          map: item.map,
          pickedBy: item.pickedBy,
          won: item.won,
        };
      });

      return {
        id,
        time,
        team1: {
          name: team1Name,
          logo: team1Logo,
        },
        team2: {
          name: team2Name,
          logo: team2Logo,
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
        },
        meta,
        status,
      };
    });

    return await Promise.all(response);
  }

  async createMatch(dto: CreateMatchDto) {
    const match = await this.matchesRepository.create(dto);

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
}
