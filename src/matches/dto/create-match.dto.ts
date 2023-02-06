export class CreateMatchDto {
  readonly time: string;

  readonly picks: string[];

  readonly matchType: 'LAN' | 'Online';

  readonly meta: 'bo1' | 'bo2' | 'bo3' | 'bo5';

  readonly status: 'upcoming' | 'ended';
}
