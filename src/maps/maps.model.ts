import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Score } from '../scores/scores.model';
import { ApiProperty } from '@nestjs/swagger';

export interface MapCreationAttrs {
  team1MapScore: number;
  team1CTScore: number;
  team1TScore: number;
  team2MapScore: number;
  team2CTScore: number;
  team2TScore: number;
  name: string;
  pickedBy: 'team1' | 'team2' | 'decider';
  number: number;
}

@Table({ tableName: 'maps' })
export class Map extends Model<Map, MapCreationAttrs> {
  @ApiProperty({
    example: '511',
    required: true,
    description: 'ID of the map',
  })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  })
  id: number;

  @ApiProperty({
    example: '16',
    required: true,
    description: 'The total score of the first team on this map',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  team1MapScore: number;

  @ApiProperty({
    example: '11',
    required: true,
    description:
      'The score of the first team for the counter-terrorists side on this map',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  team1CTScore: number;

  @ApiProperty({
    example: '5',
    required: true,
    description:
      'The score of the first team for the terrorists side on this map',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  team1TScore: number;

  @ApiProperty({
    example: '8',
    required: true,
    description: 'The total score of the second team on this map',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  team2MapScore: number;

  @ApiProperty({
    example: '4',
    required: true,
    description:
      'The score of the first team for the counter-terrorists side on this map',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  team2CTScore: number;

  @ApiProperty({
    example: '4',
    required: true,
    description:
      'The score of the first team for the terrorists side on this map',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  team2TScore: number;

  @ApiProperty({
    example: 'Inferno',
    required: true,
    description: 'Name of the map',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({
    example: 'team2',
    required: true,
    description: 'The team that picked this map',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  pickedBy: string;

  @ApiProperty({
    example: '1',
    required: true,
    description: 'Sequence number of the map',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  number: number;

  @ApiProperty({
    required: true,
    description: 'ID of the score related with the map',
  })
  @ForeignKey(() => Score)
  scoreId: number;

  @ApiProperty({
    required: true,
    description: 'Score related with the map',
  })
  @BelongsTo(() => Score)
  score: Score;
}
