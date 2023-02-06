import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Event } from './events.model';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({ status: 200, type: [Event] })
  @Get()
  getAll() {
    return this.eventsService.getAll();
  }

  @ApiOperation({ summary: 'Get team by name' })
  @ApiResponse({ status: 200, type: [Event] })
  @Get(':name')
  getByName(@Param('name') name: string) {
    return this.eventsService.getEventByName(name);
  }

  @Post()
  create(@Body() eventDto: CreateEventDto) {
    return this.eventsService.createEvent(eventDto);
  }
}
