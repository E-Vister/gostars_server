import { Body, Controller, Get, Post } from '@nestjs/common';
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

  @Post()
  create(@Body() matchDto: CreateMatchDto) {
    return this.matchesService.createMatch(matchDto);
  }
}
