import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Match } from './matches.model';
import { CreateMatchDto } from './dto/create-match.dto';
import { TeamsService } from '../teams/teams.service';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel(Match) private matchesRepository: typeof Match,
    private teamsService: TeamsService,
  ) {}

  async getAll() {
    return await this.matchesRepository.findAll({ include: { all: true } });
  }

  async createMatch(dto: CreateMatchDto) {
    const match = await this.matchesRepository.create(dto);
    const team1 = await this.teamsService.getTeamByName('Natus Vincere');
    const team2 = await this.teamsService.getTeamByName('G2');

    await match.$set('teams', [team1.id]);
    await match.$add('teams', [team2.id]);

    return match;
  }
}
