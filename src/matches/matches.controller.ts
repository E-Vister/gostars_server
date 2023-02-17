import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Match } from './matches.model';
import { CreateMatchDto } from './dto/create-match.dto';

@ApiTags('Matches')
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @ApiOperation({ summary: 'Get matches list' })
  @ApiResponse({ status: 200, type: [Match] })
  @Get()
  getAll() {
    return this.matchesService.getAll();
  }

  @ApiOperation({ summary: 'Get only ended matches' })
  @ApiResponse({ status: 200, type: [Match] })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'offset in the results list',
  })
  @Get('/results')
  getEndedMatches(@Query('offset') offset: number) {
    return this.matchesService.getEndedMatches(offset || 0);
  }

  @ApiOperation({ summary: 'Get only upcoming matches' })
  @ApiResponse({ status: 200, type: [Match] })
  @Get('/upcoming')
  getUpcomingMatches() {
    return this.matchesService.getUpcomingMatches();
  }

  @ApiOperation({ summary: 'Get match by id' })
  @ApiResponse({ status: 200, type: Match })
  @ApiParam({
    name: 'matchId',
    required: true,
    description: 'Match identifier',
  })
  @Get(':matchId')
  getMatchById(@Param('matchId') matchId: string) {
    return this.matchesService.getMatchById(matchId);
  }

  @ApiOperation({ summary: 'Create match' })
  @ApiResponse({ status: 200, type: Match })
  @Post()
  create(@Body() matchDto: CreateMatchDto) {
    return this.matchesService.createMatch(matchDto);
  }

  @ApiOperation({ summary: 'Delete match by id' })
  @ApiResponse({ status: 200 })
  @ApiParam({
    name: 'matchId',
    required: true,
    description: 'Match identifier',
  })
  @Delete(':matchId')
  removeMatchById(@Param('matchId') matchId: string) {
    return this.matchesService.removeMatchById(matchId);
  }
}
