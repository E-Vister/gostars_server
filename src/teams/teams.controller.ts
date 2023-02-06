import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { Team } from './teams.model';
import { CreateTeamDto } from './dto/create-team.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @ApiOperation({ summary: 'Get team by name' })
  @ApiResponse({ status: 200, type: [Team] })
  @Get(':name')
  getByName(@Param('name') name: string) {
    return this.teamsService.getTeamByName(name);
  }

  @Post()
  create(@Body() teamDto: CreateTeamDto) {
    return this.teamsService.createTeam(teamDto);
  }
}
