import { CreateTeamDto } from '../../teams/dto/create-team.dto';
import { CreateScoreDto } from '../../scores/dto/create-score.dto';

export class CreateMatchDto {
  readonly id: number;

  readonly date: Date;

  readonly team1: CreateTeamDto;

  readonly team2: CreateTeamDto;

  readonly score: CreateScoreDto;

  readonly picks: string[];

  readonly matchEvent: { id: number; name: string; logo: string };

  readonly matchType: string;

  readonly meta: string;

  readonly status: string;
  readonly stream: string;
}
