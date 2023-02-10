import { Module } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { ScoresController } from './scores.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Score } from './scores.model';
import { Match } from '../matches/matches.model';
import { Map } from '../maps/maps.model';
import { MapsModule } from '../maps/maps.module';

@Module({
  providers: [ScoresService],
  controllers: [ScoresController],
  imports: [SequelizeModule.forFeature([Score, Match, Map]), MapsModule],
  exports: [ScoresService],
})
export class ScoresModule {}
