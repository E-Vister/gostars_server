import { CreateTeamDto } from '../../teams/dto/create-team.dto';
import { CreateScoreDto } from '../../scores/dto/create-score.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchDto {
  @ApiProperty({
    example: '23582',
    required: true,
    description: 'Id of the match',
  })
  readonly id: number;

  @ApiProperty({
    example: '2023-02-07T19:45:00.000Z',
    required: true,
    description: 'Date of the match',
  })
  readonly date: Date;

  @ApiProperty({
    required: true,
    description: 'The left (first) team of the match',
  })
  readonly team1: CreateTeamDto;

  @ApiProperty({
    required: true,
    description: 'The right (second) team of the match',
  })
  readonly team2: CreateTeamDto;

  @ApiProperty({
    required: true,
    description: 'Detailed score of the match',
  })
  readonly score: CreateScoreDto;

  @ApiProperty({
    example:
      '["Vertigo","Overpass","Inferno","Nuke","Anubis","Ancient","Mirage"]',
    required: true,
    description: 'Map picks of the match',
  })
  readonly picks: string[];

  @ApiProperty({
    properties: {
      id: {
        type: 'number',
        example: '6809',
        description: 'ID of the event',
      },
      name: {
        type: 'string',
        example: 'IEM Katowice 2023',
        description: 'Name of the event to be created',
      },
      logo: {
        type: 'string',
        example: 'https://i.imgur.com/9pq9MA4.png',
        description: 'String link to the logo of the event',
      },
    },
    required: true,
    description: 'Event related to the match',
  })
  readonly matchEvent: { id: number; name: string; logo: string };

  @ApiProperty({
    example: 'LAN',
    required: true,
    description: 'The venue of the match. Online or in the arena',
  })
  readonly matchType: string;

  @ApiProperty({
    example: 'bo3',
    required: true,
    description: 'Type of match duration',
  })
  readonly meta: string;

  @ApiProperty({
    example: 'ended',
    required: true,
    description: 'Match completion status',
  })
  readonly status: string;

  @ApiProperty({
    example:
      'https://player.twitch.tv/?video=v1730848951&autoplay=true&t=9h15m43s&parent=',
    required: true,
    description: 'Link to an embedded match record or live broadcast',
  })
  readonly stream: string;
}
