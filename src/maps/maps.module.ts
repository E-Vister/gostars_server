import { Module } from '@nestjs/common';
import { MapsService } from './maps.service';
import { MapsController } from './maps.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Score } from '../scores/scores.model';
import { Match } from '../matches/matches.model';
import { Map } from './maps.model';

@Module({
  providers: [MapsService],
  controllers: [MapsController],
  imports: [SequelizeModule.forFeature([Score, Match, Map])],
  exports: [MapsService],
})
export class MapsModule {}
