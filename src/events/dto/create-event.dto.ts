import { ApiProperty } from '@nestjs/swagger';
import { CreateMatchDto } from '../../matches/dto/create-match.dto';

export class CreateEventDto {
  @ApiProperty({
    example: 'IEM Katowice 2023',
    required: true,
    description: 'Name of the event to be created',
  })
  readonly name: string;

  @ApiProperty({
    example: 'https://i.imgur.com/9pq9MA4.png',
    required: true,
    description: 'String link to the logo of the event',
  })
  readonly logo: string;

  @ApiProperty({
    example: 'https://i.imgur.com/qlUqgmU.png',
    required: true,
    description: 'String link to the banner of the event',
  })
  readonly banner: string;

  @ApiProperty({
    example: '$100.000',
    required: true,
    description: 'The prize fund of the event',
  })
  readonly prizePool: string;

  @ApiProperty({
    example: '16',
    required: true,
    description: 'The number of teams participating in the event',
  })
  readonly teamsNumber: string;

  @ApiProperty({
    example: 'LIVE',
    required: true,
    description: 'Event completion status',
  })
  readonly eventStatus: string;

  @ApiProperty({
    required: true,
    properties: {
      flag: {
        type: 'string',
        example: 'https://www.hltv.org/img/static/flags/30x20/PL.gif',
        description:
          'String link to the flag of the location where the event is being held',
      },
      place: {
        type: 'string',
        example: 'Katowice, Poland',
        description: 'Location of the event',
      },
    },
    description: 'Location of the event',
  })
  readonly location: ILocation;

  @ApiProperty({
    required: true,
    properties: {
      from: {
        type: 'Date',
        example: '2023-02-03T21:00:00.000Z',
        description: 'Start date of the event',
      },
      to: {
        type: 'Date',
        example: '2023-02-11T21:00:00.000Z',
        description: 'End date of the event',
      },
    },
    description: 'Time period of the event',
  })
  readonly date: IDate;

  @ApiProperty({
    example: '6809',
    required: true,
    description: 'ID of the event',
  })
  readonly id: number;

  readonly results?: CreateMatchDto[];
}

interface IDate {
  from: Date;
  to: Date;
}

interface ILocation {
  flag: string;
  place: string;
}
