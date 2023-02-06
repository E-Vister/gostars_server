import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Match } from '../matches/matches.model';
import { Event } from './events.model';

@Module({
  providers: [EventsService],
  controllers: [EventsController],
  imports: [SequelizeModule.forFeature([Match, Event])],
  exports: [EventsService],
})
export class EventsModule {}
