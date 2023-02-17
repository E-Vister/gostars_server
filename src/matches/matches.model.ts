import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Team } from '../teams/teams.model';
import { Event } from '../events/events.model';
import { MatchTeams } from '../teams/match-teams.model';
import { Score } from '../scores/scores.model';
import { ApiProperty } from "@nestjs/swagger";

interface MatchCreationAttrs {
  id: number;
  date: Date;
  team1Name: string;
  team2Name: string;
  picks: string[];
  matchType: string;
  meta: string;
  status: string;

  stream: string;
}

@Table({ tableName: 'matches' })
export class Match extends Model<Match, MatchCreationAttrs> {
  @ApiProperty({
    example: '23582',
    required: true,
    description: 'ID of the match',
  })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    unique: true,
  })
  id: number;

  @ApiProperty({
    example: '2023-02-07T19:45:00.000Z',
    required: true,
    description: 'Date of the match',
  })
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date: Date;

  @ApiProperty({
    required: true,
    description: 'ID of the teams related with the match',
  })
  @BelongsToMany(() => Team, () => MatchTeams)
  teams: Team[];

  @ApiProperty({
    required: true,
    description: 'ID of the event related with the match',
  })
  @ForeignKey(() => Event)
  eventId: number;

  @ApiProperty({
    required: true,
    description: 'Event related with the match',
  })
  @BelongsTo(() => Event)
  event: Event;

  @ApiProperty({
    required: true,
    description: 'ID of the score related with the match',
  })
  @ForeignKey(() => Score)
  scoreId: number;

  @ApiProperty({
    required: true,
    description: 'Score related with the match',
  })
  @BelongsTo(() => Score)
  score: Score;

  @ApiProperty({
    example: 'G2',
    required: true,
    description: 'Name of the first team of the match',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  team1Name: string;

  @ApiProperty({
    example: 'Natus Vincere',
    required: true,
    description: 'Name of the second team of the match',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  team2Name: string;

  @ApiProperty({
    example:
      '["Vertigo","Overpass","Inferno","Nuke","Anubis","Ancient","Mirage"]',
    required: true,
    description: 'Map picks of the match',
  })
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  picks: string[];

  @ApiProperty({
    example: 'LAN',
    required: true,
    description: 'The venue of the match. Online or in the arena',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  matchType: string;

  @ApiProperty({
    example: 'bo3',
    required: true,
    description: 'Type of match duration',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  meta: string;

  @ApiProperty({
    example: 'ended',
    required: true,
    description: 'Match completion status',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status: string;

  @ApiProperty({
    example:
      'https://player.twitch.tv/?video=v1730848951&autoplay=true&t=9h15m43s&parent=',
    required: true,
    description: 'Link to an embedded match record or live broadcast',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  stream: string;
}
