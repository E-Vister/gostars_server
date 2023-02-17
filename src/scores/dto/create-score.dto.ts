import { CreateMapDto } from '../../maps/dto/create-map.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScoreDto {
  @ApiProperty({
    properties: {
      team1: {
        type: 'number',
        example: '2',
        description: 'Total score of the first team',
      },
      team2: {
        type: 'number',
        example: '0',
        description: 'Total score of the second team',
      },
    },
    required: true,
    description: 'Main score of the match',
  })
  main: IMainScore;

  @ApiProperty({
    required: true,
    description: 'Maps of the match',
  })
  maps: CreateMapDto[];

  @ApiProperty({
    example: 'team2',
    required: true,
    description: 'The team that makes the first choice in the map veto',
  })
  firstPick: string;
}

type IMainScore = {
  team1: number;
  team2: number;
};
