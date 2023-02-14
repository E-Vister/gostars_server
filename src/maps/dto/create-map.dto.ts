export class CreateMapDto {
  team1: ITeamScore;
  team2: ITeamScore;
  name: string;
  pickedBy: 'team1' | 'team2' | 'decider';
  number: number;
}

type ITeamScore = {
  totalScore: number;
  tSideScore: number;
  ctSideScore: number;
};
