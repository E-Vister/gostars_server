import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './events.model';
import HLTV from 'hltv-api19028309';
import { CreateMatchDto } from '../matches/dto/create-match.dto';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event) private eventsRepository: typeof Event) {}

  async getAll() {
    return await this.eventsRepository.findAll();
  }

  async getEventById(id: number): Promise<CreateEventDto> {
    try {
      const event = await this.eventsRepository.findOne({ where: { id } });

      if (!event) {
        await this.cacheEvent({ id, name: '', logo: '' });
      }

      const {
        name,
        logo,
        banner,
        prizePool,
        teamsNumber,
        eventStatus,
        locationFlag,
        locationPlace,
        dateFrom,
        dateTo,
      } = await this.eventsRepository.findOne({
        where: { id },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });

      const { results } = await HLTV.getEvent(id.toString());

      const formattedResults = results.map((result) => {
        return {
          date: new Date(Date.parse(result.time)),
          team1: {
            name: result.team1.name,
            logo: result.team1.logo,
          },
          team2: {
            name: result.team2.name,
            logo: result.team2.logo,
          },
          matchEvent: result.event,
          matchType: '',
          score: {
            main: {
              team1: result.team1.result,
              team2: result.team2.result,
            },
            maps: [],
          },
          meta: result.meta,
          id: result.matchId,
        };
      });

      return {
        name,
        id,
        banner,
        logo,
        prizePool,
        teamsNumber,
        eventStatus,
        location: {
          flag: locationFlag,
          place: locationPlace,
        },
        date: {
          from: dateFrom,
          to: dateTo,
        },
        results: formattedResults as CreateMatchDto[],
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  async cacheEvent(dto: { id: number; name: string; logo: string }) {
    const event = await this.eventsRepository.findOne({
      where: { id: dto.id },
    });
    if (event === null) {
      const {
        id: eventId,
        banner,
        logo,
        name,
        prizePool,
        eventStatus,
        teamsNumber,
        date,
        location,
      } = await HLTV.getEvent(dto.id.toString());

      await this.createEvent({
        id: eventId,
        banner,
        logo,
        name,
        prizePool,
        eventStatus,
        teamsNumber,
        date: {
          from: new Date(Date.parse(date.from)),
          to: new Date(Date.parse(date.to)),
        },
        location,
      });
    }

    return await this.eventsRepository.findOne({
      where: { id: dto.id },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
  }

  async createEvent(dto: CreateEventDto) {
    const createObj = {
      id: dto.id,
      name: dto.name,
      banner: dto.banner,
      logo: dto.logo,
      prizePool: dto.prizePool,
      eventStatus: dto.eventStatus,
      teamsNumber: dto.teamsNumber,
      locationFlag: dto.location.flag,
      locationPlace: dto.location.place,
      dateFrom: dto.date.from,
      dateTo: dto.date.to,
    };

    return await this.eventsRepository.create(createObj);
  }
}
