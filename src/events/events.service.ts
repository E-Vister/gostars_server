import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './events.model';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event) private eventsRepository: typeof Event) {}

  async getAll() {
    return await this.eventsRepository.findAll();
  }

  async getEventByName(name: string) {
    return await this.eventsRepository.findOne({
      where: { name },
    });
  }

  async createEvent(dto: CreateEventDto) {
    return await this.eventsRepository.create(dto);
  }
}
