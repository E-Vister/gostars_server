import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Match } from '../matches/matches.model';
import { MatchTeams } from './match-teams.model';

export interface TeamCreationAttrs {
  name: string;

  logo: string;
  country: string;
}

@Table({ tableName: 'teams' })
export class Team extends Model<Team, TeamCreationAttrs> {
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

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  country: string;

  @BelongsToMany(() => Match, () => MatchTeams)
  matches: Match[];
}
