import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { Match } from './matches.model';
import { CreateMatchDto } from './dto/create-match.dto';

@ApiTags('Matches')
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @ApiOperation({ summary: 'Get matches list' })
  @ApiResponse({ status: 200, type: [CreateMatchDto] })
  @Get()
  async getAll() {
    try {
      return await this.matchesService.getAll();
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({ summary: 'Get only ended matches' })
  @ApiResponse({ status: 200, type: [CreateMatchDto] })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'offset in the results list',
    schema: {
      type: 'integer',
      default: 0,
    },
  })
  @Get('/results')
  async getEndedMatches(
    @Query('offset', ParseIntPipe) offset = 0,
  ): Promise<CreateMatchDto[]> {
    try {
      return await this.matchesService.getEndedMatches(offset);
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({ summary: 'Get only upcoming matches' })
  @ApiResponse({ status: 200, type: [Match] })
  @Get('/upcoming')
  async getUpcomingMatches(): Promise<CreateMatchDto[]> {
    try {
      return await this.matchesService.getUpcomingMatches();
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({ summary: 'Get match by id' })
  @ApiResponse({ status: 200, type: CreateMatchDto })
  @ApiParam({
    name: 'matchId',
    required: true,
    description: 'Match identifier',
    schema: {
      type: 'string',
    },
  })
  @Get(':matchId')
  async getMatchById(@Param('matchId') matchId: string) {
    try {
      return await this.matchesService.getMatchById(matchId);
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({ summary: 'Create match' })
  @ApiCreatedResponse({
    description: 'The match has been successfully created.',
    type: CreateMatchDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Post()
  async create(
    @Body() createMatchDto: CreateMatchDto,
  ): Promise<Match | { error: string }> {
    try {
      if (!createMatchDto) {
        throw new BadRequestException('Missing required fields.');
      }
      return this.matchesService.createMatch(createMatchDto);
    } catch (error) {
      return { error: error.message };
    }
  }

  @ApiOperation({ summary: 'Delete match by id' })
  @ApiResponse({ status: 204 })
  @ApiParam({
    name: 'matchId',
    required: true,
    description: 'Match identifier',
    schema: {
      type: 'string',
    },
  })
  @Delete(':matchId')
  async removeMatchById(
    @Param('matchId') matchId: string,
  ): Promise<{ code: number }> {
    try {
      return await this.matchesService.removeMatchById(matchId);
    } catch (err) {
      throw err;
    }
  }
}
