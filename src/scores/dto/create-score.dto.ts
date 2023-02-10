import { CreateMapDto } from '../../maps/dto/create-map.dto';

export class CreateScoreDto {
  main: IMainScore;
  maps: CreateMapDto[];
}

type IMainScore = {
  team1: number;
  team2: number;
};
