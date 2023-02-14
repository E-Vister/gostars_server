import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Map } from './maps.model';
import { CreateMapDto } from './dto/create-map.dto';

@Injectable()
export class MapsService {
  constructor(@InjectModel(Map) private mapsRepository: typeof Map) {}

  async createMaps(dto: CreateMapDto[], scoreId) {
    if (!dto) return;

    const maps = dto.map((map) => {
      return {
        team1MapScore: map.team1.totalScore,
        team1CTScore: map.team1.ctSideScore,
        team1TScore: map.team1.tSideScore,
        team2MapScore: map.team2.totalScore,
        team2CTScore: map.team2.ctSideScore,
        team2TScore: map.team2.tSideScore,
        name: map.name,
        pickedBy: map.pickedBy,
        number: map.number,
      };
    });

    const createdMaps = await this.mapsRepository.bulkCreate(maps, {
      ignoreDuplicates: true,
    });

    createdMaps.map(async (item) => {
      return await item.$set('score', scoreId);
    });

    return createdMaps;
  }

  async removeScoreMaps(scoreId: string) {
    await this.mapsRepository.destroy({
      where: { scoreId },
    });

    return { code: 200 };
  }
}
