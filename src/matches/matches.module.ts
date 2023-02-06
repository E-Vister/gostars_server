import { Module } from '@nestjs/common';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Match } from './matches.model';
import { Team } from '../teams/teams.model';
import { TeamsModule } from '../teams/teams.module';
import { MatchTeams } from '../teams/match-teams.model';

@Module({
  controllers: [MatchesController],
  providers: [MatchesService],
  imports: [SequelizeModule.forFeature([Match, Team, MatchTeams]), TeamsModule],
})
export class MatchesModule {}
