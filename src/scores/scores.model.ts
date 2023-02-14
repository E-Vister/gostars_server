import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Map } from '../maps/maps.model';

export interface ScoreCreationAttrs {
  team1Score: number;
  team2Score: number;
  firstPick: string;
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

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  firstPick: string;

  @HasMany(() => Map)
  maps: Map[];
}
