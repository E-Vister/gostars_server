import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Match } from '../matches/matches.model';

export interface EventCreationAttrs {
  name: string;

  logo: string;
}

@Table({ tableName: 'events' })
export class Event extends Model<Event, EventCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  logo: string;

  @HasMany(() => Match)
  matches: Match[];
}
