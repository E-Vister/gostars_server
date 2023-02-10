import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Score } from './scores.model';
import { MapsService } from '../maps/maps.service';
import { CreateScoreDto } from './dto/create-score.dto';

@Injectable()
export class ScoresService {
  constructor(
    @InjectModel(Score) private scoresRepository: typeof Score,
    private mapsService: MapsService,
  ) {}

  async cacheScore({ main, maps }: CreateScoreDto) {
    const scoreDto = { team1Score: main.team1, team2Score: main.team2 };
    const score = await this.scoresRepository.create(scoreDto);
    await this.mapsService.createMaps(maps, score.id);

    return await this.getScoreById(score.id);
  }

  async getScoreById(id: number) {
    return await this.scoresRepository.findOne({
      where: { id },
      include: { all: true },
    });
  }
}
