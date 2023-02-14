import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Score } from '../scores/scores.model';

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
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  })
  id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  team1MapScore: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  team1CTScore: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  team1TScore: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  team2MapScore: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  team2CTScore: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  team2TScore: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  pickedBy: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  number: number;

  @ForeignKey(() => Score)
  scoreId: number;

  @BelongsTo(() => Score)
  score: Score;
}
