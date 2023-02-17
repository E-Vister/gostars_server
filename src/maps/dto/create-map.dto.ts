import { ApiProperty } from '@nestjs/swagger';

export class CreateMapDto {
  @ApiProperty({
    required: true,
    description: 'The detailed score of the first team on this map',
  })
  team1: ITeamScore;

  @ApiProperty({
    required: true,
    description: 'The detailed score of the second team on this map',
  })
  team2: ITeamScore;

  @ApiProperty({
    example: 'Inferno',
    required: true,
    description: 'Name of the map',
  })
  name: string;

  @ApiProperty({
    example: 'team2',
    required: true,
    description: 'The team that picked this map',
  })
  pickedBy: 'team1' | 'team2' | 'decider';

  @ApiProperty({
    example: '1',
    required: true,
    description: 'Sequence number of the map',
  })
  number: number;
}

type ITeamScore = {
  totalScore: number;
  tSideScore: number;
  ctSideScore: number;
};
