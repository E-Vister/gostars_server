import { CreateMatchDto } from "../../matches/dto/create-match.dto";

export class CreateEventDto {
  readonly name: string;
  readonly logo: string;
  readonly banner: string;
  readonly prizePool: string;
  readonly teamsNumber: string;
  readonly eventStatus: string;
  readonly location: ILocation;
  readonly date: IDate;
  readonly id: number;
  readonly results?: CreateMatchDto[];
}

interface IDate {
  from: Date;
  to: Date;
}

interface ILocation {
  flag: string;
  place: string;
}
