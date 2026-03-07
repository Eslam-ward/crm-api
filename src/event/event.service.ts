import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event, EventDocument } from './schema/event.schema';
import { buildQueryDto } from 'src/common/dto/base-query.dto';
import { ApiFeatures } from 'src/common/utils/api-features';
import { EventHelper } from 'src/common/helpers/event.helper';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>,
  ) {}

 
  async create(createEventDto: CreateEventDto):Promise<Event> {
    const { assignedTo } = createEventDto;

   const eventDateTime = EventHelper.combineDateTime(
      createEventDto.date as any,
      createEventDto.time,
    );

    EventHelper.validatePastDate(eventDateTime);

    const existingEvent = await this.eventModel.findOne({
      assignedTo,
      date: eventDateTime,
    });

    if (existingEvent) {
      throw new ConflictException(
        'This user already has an event at this time',
      );
    }

    const event = await this.eventModel.create({
      ...createEventDto,
      date: eventDateTime,
    });

  

    return event;
  }

  async findAll(query:buildQueryDto){
      const features = new ApiFeatures(
         this.eventModel.find().lean().populate(EventHelper.getPopulateQuery()),
         query,
       )
         .filter()
         .search(['title','location']);
   
       const total = await features.count();
   
       features.sort().limitFields().paginate(total);
   
       const data = await features.exec();
       const formattedEvents = data.map(event =>
        EventHelper.formatEvent(event),
       )
   
       return {
         results: data.length,
         pagination: features.paginationResult,
         data: formattedEvents,
       };
  }


  async findOne(id: string):Promise<Event> {
    const event = await this.eventModel
      .findById(id)
      .populate(EventHelper.getPopulateQuery());

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return EventHelper.formatEvent(event);;
  }

 
async update(
  id: string,
  updateEventDto: UpdateEventDto,
): Promise<EventDocument> {

  const event = await this.eventModel.findById(id);

  if (!event) {
    throw new NotFoundException('Event not found');
  }

  const assignedTo = updateEventDto.assignedTo ?? event.assignedTo;

  let eventDateTime = event.date;

  if (updateEventDto.date || updateEventDto.time) {

    const date = updateEventDto.date ?? event.date.toISOString().split('T')[0];
    const time = updateEventDto.time ?? event.time;

    eventDateTime = EventHelper.combineDateTime(date, time);

    EventHelper.validatePastDate(eventDateTime);

    const conflict = await this.eventModel.findOne({
      _id: { $ne: id },
      assignedTo,
      date: eventDateTime,
    });

    if (conflict) {
      throw new ConflictException(
        'This user already has an event at this time',
      );
    }
  }

  const updatedEvent = await this.eventModel.findByIdAndUpdate(
    id,
    {
      ...updateEventDto,
      assignedTo,
      date: eventDateTime,
    },
    { new: true },
  );

  if (!updatedEvent) {
    throw new NotFoundException('Event not found after update');
  }

  return updatedEvent;
}
  async remove(id: string):Promise<{message:string}> {


    const event = await this.eventModel.findByIdAndDelete(id);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return {
      message: 'Event deleted successfully',
    };
  }
}