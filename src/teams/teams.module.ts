import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Team } from './teams.model';
import { Match } from '../matches/matches.model';
import { MatchTeams } from './match-teams.model';

@Module({
  providers: [TeamsService],
  controllers: [TeamsController],
  imports: [SequelizeModule.forFeature([Match, Team, MatchTeams])],
  exports: [TeamsService],
})
export class TeamsModule {}
