import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { MatchesService } from './matches.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Match } from './matches.model';
import { CreateMatchDto } from './dto/create-match.dto';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @ApiOperation({ summary: 'Get matches list' })
  @ApiResponse({ status: 200, type: [Match] })
  @Get()
  getAll() {
    return this.matchesService.getAll();
  }

  @Get('/results')
  getEndedMatches(@Query('offset') offset: number) {
    return this.matchesService.getEndedMatches(offset || 0);
  }

  @Get('/upcoming')
  getUpcomingMatches() {
    return this.matchesService.getUpcomingMatches();
  }

  @Get(':matchId')
  getMatchById(@Param('matchId') matchId: string) {
    return this.matchesService.getMatchById(matchId);
  }

  @Post()
  create(@Body() matchDto: CreateMatchDto) {
    return this.matchesService.createMatch(matchDto);
  }

  @Delete(':matchId')
  removeMatchById(@Param('matchId') matchId: string) {
    return this.matchesService.removeMatchById(matchId);
  }
}
