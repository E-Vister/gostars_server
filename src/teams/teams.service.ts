import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Team } from './teams.model';
import { CreateTeamDto } from './dto/create-team.dto';

@Injectable()
export class TeamsService {
  constructor(@InjectModel(Team) private teamsRepository: typeof Team) {}

  async getTeamByName(name: string) {
    return await this.teamsRepository.findOne({
      where: { name },
    });
  }

  async cacheTeam(dto: CreateTeamDto) {
    let team = await this.getTeamByName(dto.name);

    if (team === null) {
      team = await this.createTeam(dto);
    }

    return team;
  }

  async createTeam(dto: CreateTeamDto) {
    return await this.teamsRepository.create(dto);
  }
}
