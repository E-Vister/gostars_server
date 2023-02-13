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

interface MatchCreationAttrs {
  date: Date;
  picks: string[];
  matchType: 'LAN' | 'Online';
  meta: 'bo1' | 'bo2' | 'bo3' | 'bo5';
  status: 'upcoming' | 'ended';
}

@Table({ tableName: 'matches' })
export class Match extends Model<Match, MatchCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  })
  id: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date: Date;

  @BelongsToMany(() => Team, () => MatchTeams)
  teams: Team[];

  @ForeignKey(() => Event)
  eventId: number;

  @BelongsTo(() => Event)
  event: Event;

  @ForeignKey(() => Score)
  scoreId: number;

  @BelongsTo(() => Score)
  score: Score;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  picks: string[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  matchType: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  meta: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status: string;
}
