import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Match } from './matches.model';
import { CreateMatchDto } from './dto/create-match.dto';
import { TeamsService } from '../teams/teams.service';
import { EventsService } from '../events/events.service';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel(Match) private matchesRepository: typeof Match,
    private teamsService: TeamsService,
    private eventsService: EventsService,
  ) {}

  async getAll() {
    const matches = await this.matchesRepository.findAll({
      include: { all: true },
    });

    return matches.map((match) => {
      const { id, time, picks, matchType, meta, status } = match;
      const { name: team1Name, logo: team1Logo } = match.teams[0];
      const { name: team2Name, logo: team2Logo } = match.teams[1];
      const { name: eventName, logo: eventLogo } = match.event;

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
  }

  async createMatch(dto: CreateMatchDto) {
    const match = await this.matchesRepository.create(dto);
    const event = await this.eventsService.getEventByName(
      'BLAST Premier Spring Groups 2023',
    );
    const team1 = await this.teamsService.getTeamByName('Natus Vincere');
    const team2 = await this.teamsService.getTeamByName('G2');

    if (match && event && team1 && team2) {
      await match.$set('teams', [team1.id, team2.id]).then(async () => {
        await match.$set('event', event.id);
      });

      return match;
    } else {
      return { error: 'Some properties are missing' };
    }
  }
}
