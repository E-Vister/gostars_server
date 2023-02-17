import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty({
    example: 'Natus Vincere',
    required: true,
    description: 'Name of the team to be created',
  })
  readonly name: string;

  @ApiProperty({
    example:
      'https://upload.wikimedia.org/wikipedia/ru/thumb/5/5f/NAVI_Logo.svg/360px-NAVI_Logo.svg.png',
    required: true,
    description: 'String link to the logo of the team',
  })
  readonly logo: string;

  @ApiProperty({
    example: 'UA',
    required: true,
    description: 'Country code of the team',
  })
  readonly country: string;
}
