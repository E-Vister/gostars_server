import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Match } from '../matches/matches.model';
import { ApiProperty } from '@nestjs/swagger';

export interface EventCreationAttrs {
  id: number;
  banner: string;
  name: string;
  logo: string;
  prizePool: string;
  teamsNumber: string;
  eventStatus: string;
  locationFlag: string;
  locationPlace: string;
  dateFrom: Date;
  dateTo: Date;
}

@Table({ tableName: 'events' })
export class Event extends Model<Event, EventCreationAttrs> {
  @ApiProperty({
    example: '6809',
    required: true,
    description: 'ID of the event',
  })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    unique: true,
  })
  id: number;

  @ApiProperty({
    example: 'IEM Katowice 2023',
    required: true,
    description: 'Name of the event to be created',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({
    example: 'https://i.imgur.com/9pq9MA4.png',
    required: true,
    description: 'String link to the logo of the event',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  logo: string;

  @ApiProperty({
    example: 'https://i.imgur.com/qlUqgmU.png',
    required: true,
    description: 'String link to the banner of the event',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  banner: string;

  @ApiProperty({
    example: '$100.000',
    required: true,
    description: 'The prize fund of the event',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  prizePool: string;

  @ApiProperty({
    example: '16',
    required: true,
    description: 'The number of teams participating in the event',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  teamsNumber: string;

  @ApiProperty({
    example: 'LIVE',
    required: true,
    description: 'Event completion status',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  eventStatus: string;

  @ApiProperty({
    example: 'https://www.hltv.org/img/static/flags/30x20/PL.gif',
    required: true,
    description:
      'String link to the flag of the location where the event is being held',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  locationFlag: string;

  @ApiProperty({
    example: 'Katowice, Poland',
    required: true,
    description: 'Location of the event',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  locationPlace: string;

  @ApiProperty({
    example: '2023-02-03T21:00:00.000Z',
    required: true,
    description: 'Start date of the event',
  })
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  dateFrom: Date;

  @ApiProperty({
    example: '2023-02-11T21:00:00.000Z',
    required: true,
    description: 'End date of the event',
  })
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  dateTo: Date;

  @ApiProperty({
    required: true,
    description: 'Matches related to this event',
  })
  @HasMany(() => Match)
  matches: Match[];
}
