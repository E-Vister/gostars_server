import { Module } from '@nestjs/common';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Match } from './matches.model';
import { Team } from '../teams/teams.model';
import { TeamsModule } from '../teams/teams.module';
import { MatchTeams } from '../teams/match-teams.model';
import { EventsModule } from '../events/events.module';
import { ScoresModule } from '../scores/scores.module';
import { Score } from '../scores/scores.model';
import { Map } from '../maps/maps.model';

@Module({
  controllers: [MatchesController],
  providers: [MatchesService],
  imports: [
    SequelizeModule.forFeature([Match, Team, MatchTeams, Score, Map]),
    TeamsModule,
    EventsModule,
    ScoresModule,
  ],
})
export class MatchesModule {}
