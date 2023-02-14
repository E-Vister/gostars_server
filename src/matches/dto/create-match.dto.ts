import { CreateTeamDto } from '../../teams/dto/create-team.dto';
import { CreateEventDto } from '../../events/dto/create-event.dto';
import { CreateScoreDto } from '../../scores/dto/create-score.dto';

export class CreateMatchDto {
  readonly id: number;
  readonly date: Date;

  readonly team1: CreateTeamDto;

  readonly team2: CreateTeamDto;

  readonly score: CreateScoreDto;

  readonly picks: string[];

  readonly matchEvent: CreateEventDto;

  readonly matchType: string;

  readonly meta: string;

  readonly status: string;
}
