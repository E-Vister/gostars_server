import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TeamsService } from './teams.service';
import { Team } from './teams.model';
import { CreateTeamDto } from './dto/create-team.dto';

@ApiTags('Teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @ApiOperation({ summary: 'Get team by name' })
  @ApiResponse({ status: 200, type: Team })
  @ApiParam({
    name: 'name',
    required: true,
    description: 'Team name',
  })
  @Get(':name')
  getByName(@Param('name') name: string) {
    return this.teamsService.getTeamByName(name);
  }

  @ApiOperation({ summary: 'Create team' })
  @ApiResponse({ status: 200, type: Team })
  @Post()
  create(@Body() teamDto: CreateTeamDto) {
    return this.teamsService.createTeam(teamDto);
  }
}
