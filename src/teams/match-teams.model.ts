import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Team } from './teams.model';
import { Match } from '../matches/matches.model';

@Table({ tableName: 'match_teams', createdAt: false, updatedAt: false })
export class MatchTeams extends Model<MatchTeams> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  })
  id: number;

  @ForeignKey(() => Team)
  @Column({
    type: DataType.INTEGER,
  })
  teamId: number;

  @ForeignKey(() => Match)
  @Column({
    type: DataType.INTEGER,
  })
  matchId: number;
}
