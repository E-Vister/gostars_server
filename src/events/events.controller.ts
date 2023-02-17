import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Event } from './events.model';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({ status: 200, type: [Event] })
  @Get()
  getAll() {
    return this.eventsService.getAll();
  }

  @ApiOperation({ summary: 'Get event by ID' })
  @ApiResponse({ status: 200, type: [Event] })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Event identifier',
  })
  @Get(':id')
  getEventById(@Param('id') id: string) {
    return this.eventsService.getEventById(+id);
  }

  @ApiOperation({ summary: 'Create event' })
  @ApiResponse({ status: 200, type: Event })
  @ApiBody({ type: CreateEventDto })
  @Post()
  create(@Body() eventDto: CreateEventDto) {
    return this.eventsService.createEvent(eventDto);
  }
}
