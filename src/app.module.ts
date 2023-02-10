import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { HttpModule } from '@nestjs/axios';
import { MatchesModule } from './matches/matches.module';
import { Match } from './matches/matches.model';
import { TeamsModule } from './teams/teams.module';
import { Team } from './teams/teams.model';
import { MatchTeams } from './teams/match-teams.model';
import { EventsModule } from './events/events.module';
import { Event } from './events/events.model';
import { MapsModule } from './maps/maps.module';
import { ScoresModule } from './scores/scores.module';
import { Score } from './scores/scores.model';
import { Map } from './maps/maps.model';

@Module({
  imports: [
    HttpModule,
    MatchesModule,
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [Match, Team, MatchTeams, Event, Score, Map],
      autoLoadModels: true,
    }),
    TeamsModule,
    EventsModule,
    MapsModule,
    ScoresModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
