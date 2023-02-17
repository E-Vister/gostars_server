import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Map } from '../maps/maps.model';
import { ApiProperty } from "@nestjs/swagger";

export interface ScoreCreationAttrs {
  team1Score: number;
  team2Score: number;
  firstPick: string;
}

@Table({ tableName: 'scores' })
export class Score extends Model<Score, ScoreCreationAttrs> {
  @ApiProperty({
    example: '128',
    required: true,
    description: 'ID of the score',
  })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  })
  id: number;

  @ApiProperty({
    example: '2',
    required: true,
    description: 'Total score of the first team',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  team1Score: number;

  @ApiProperty({
    example: '0',
    required: true,
    description: 'Total score of the second team',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  team2Score: number;

  @ApiProperty({
    example: 'team2',
    required: true,
    description: 'The team that makes the first choice in the map veto',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  firstPick: string;

  @ApiProperty({
    required: true,
    description: 'Maps related to this score',
  })
  @HasMany(() => Map)
  maps: Map[];
}
