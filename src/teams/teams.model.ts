import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Match } from '../matches/matches.model';
import { MatchTeams } from './match-teams.model';
import { ApiProperty } from '@nestjs/swagger';

export interface TeamCreationAttrs {
  name: string;

  logo: string;
  country: string;
}

@Table({ tableName: 'teams' })
export class Team extends Model<Team, TeamCreationAttrs> {
  @ApiProperty({
    example: '7234',
    required: true,
    description: 'ID of the team',
  })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  })
  id: number;

  @ApiProperty({
    example: 'Natus Vincere',
    required: true,
    description: 'Name of the team to be created',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({
    example:
      'https://upload.wikimedia.org/wikipedia/ru/thumb/5/5f/NAVI_Logo.svg/360px-NAVI_Logo.svg.png',
    required: true,
    description: 'String link to the logo of the team',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  logo: string;

  @ApiProperty({
    example: 'UA',
    required: true,
    description: 'Country code of the team',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  country: string;

  @ApiProperty({
    required: true,
    description: 'Matches related to this team',
  })
  @BelongsToMany(() => Match, () => MatchTeams)
  matches: Match[];
}
