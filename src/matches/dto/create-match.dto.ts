import { CreateTeamDto } from '../../teams/dto/create-team.dto';
import { CreateEventDto } from '../../events/dto/create-event.dto';
import { CreateScoreDto } from '../../scores/dto/create-score.dto';

export class CreateMatchDto {
  readonly date: Date;

  readonly team1: CreateTeamDto;

  readonly team2: CreateTeamDto;

  readonly score: CreateScoreDto;

  readonly picks: string[];

  readonly matchEvent: CreateEventDto;

  readonly matchType: 'LAN' | 'Online';

  readonly meta: 'bo1' | 'bo2' | 'bo3' | 'bo5';

  readonly status: 'upcoming' | 'ended';
}
