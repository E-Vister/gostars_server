import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Match } from '../matches/matches.model';

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
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
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

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  banner: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  prizePool: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  teamsNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  eventStatus: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  locationFlag: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  locationPlace: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  dateFrom: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  dateTo: Date;

  @HasMany(() => Match)
  matches: Match[];
}
