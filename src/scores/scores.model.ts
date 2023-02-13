import {
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Map } from '../maps/maps.model';

export interface ScoreCreationAttrs {
  team1Score: number;
  team2Score: number;
}

@Table({ tableName: 'scores' })
export class Score extends Model<Score, ScoreCreationAttrs> {
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
  team1Score: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  team2Score: number;

  @HasMany(() => Map)
  maps: Map[];
}
