import { CreateTeamDto } from '../../teams/dto/create-team.dto';
import { CreateScoreDto } from '../../scores/dto/create-score.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchDto {
  @ApiProperty({
    example: '23582',
    required: true,
    description: 'Unique identifier for the match',
  })
  readonly id: number;

  @ApiProperty({
    example: '2023-02-07T19:45:00.000Z',
    required: true,
    description: 'Date and time of the match in UTC format',
  })
  readonly date: Date;

  @ApiProperty({
    required: true,
    description:
      'Object containing information about the first(left) team in the match',
  })
  readonly team1: CreateTeamDto;

  @ApiProperty({
    required: true,
    description:
      'Object containing information about the second(right) team in the match',
  })
  readonly team2: CreateTeamDto;

  @ApiProperty({
    required: true,
    description: 'Object containing information about the score of the match',
  })
  readonly score: CreateScoreDto;

  @ApiProperty({
    example:
      '["Vertigo","Overpass","Inferno","Nuke","Anubis","Ancient","Mirage"]',
    required: true,
    description:
      'Array containing the names of the maps that were picked for the match',
  })
  readonly picks: string[];

  @ApiProperty({
    properties: {
      id: {
        type: 'number',
        example: '6809',
        description: 'Unique identifier for the event',
      },
      name: {
        type: 'string',
        example: 'IEM Katowice 2023',
        description: 'Name of the event to be created',
      },
      logo: {
        type: 'string',
        example: 'https://i.imgur.com/9pq9MA4.png',
        description: 'URL to the logo of the event',
      },
    },
    required: true,
    description:
      'Object containing information about the event in which the match was played',
  })
  readonly matchEvent: { id: number; name: string; logo: string };

  @ApiProperty({
    example: 'LAN',
    required: true,
    description: 'Type of the match (e.g. LAN, online)',
  })
  readonly matchType: string;

  @ApiProperty({
    example: 'bo3',
    required: true,
    description: 'Type of match duration (e.g. bo1, bo3)',
  })
  readonly meta: string;

  @ApiProperty({
    example: 'ended',
    required: true,
    description: 'Current status of the match (e.g. upcoming, ended)',
  })
  readonly status: string;

  @ApiProperty({
    example:
      'https://player.twitch.tv/?video=v1730848951&autoplay=true&t=9h15m43s&parent=',
    required: true,
    description: 'URL to the match record or live broadcast',
  })
  readonly stream: string;
}
