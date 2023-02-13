export class CreateMapDto {
  team1: ITeamScore;
  team2: ITeamScore;
  name:
    | 'Vertigo'
    | 'Overpass'
    | 'Nuke'
    | 'Mirage'
    | 'Ancient'
    | 'Inferno'
    | 'Anubis';
  pickedBy: 'team1' | 'team2' | 'decider';
  won: 'team1' | 'team2' | 'draw';
}

type ITeamScore = {
  totalScore: number;
  tSideScore: number;
  ctSideScore: number;
};
