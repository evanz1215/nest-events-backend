import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Logger,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from './input/create-event.dto';
import { UpdateEventDto } from './input/update-event.dto';
import { Event } from './event.entity';
import { Like, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { EventsService } from './events.service';
import { ListEvents } from './input/list.events';

@Controller('/events')
export class EventsController {
    private readonly logger = new Logger(EventsController.name);

    constructor(
        @InjectRepository(Event)
        private readonly repository: Repository<Event>,
        @InjectRepository(Attendee)
        private readonly attendeeRepository: Repository<Attendee>,
        private readonly eventsService: EventsService,
    ) {}

    @Get()
    @UsePipes(new ValidationPipe({ transform: true }))
    async findAll(@Query() filter: ListEvents) {
        this.logger.debug(filter);
        this.logger.log(`Hit the findAll route`);
        const events =
            await this.eventsService.getEventsWithAttendeeCountFilteredPaginated(
                filter,
                {
                    total: true,
                    currentPage: filter.page,
                    limit: 10,
                },
            );

        return events;
    }

    @Get('/practice')
    async practice() {
        // find where 使用object為AND，使用array為OR
        return await this.repository.find({
            select: ['id', 'when'],
            where: [
                {
                    id: MoreThan(3),
                    when: MoreThan(new Date('2021-02-12T13:00:00')),
                },
                {
                    description: Like('%meet%'),
                },
            ],
            take: 2, // limit
            skip: 1, // offset
            order: {
                id: 'DESC',
            },
        });
    }

    @Get('/practice2')
    async practice2() {
        // return await this.repository.findOne({
        //     where: {
        //         id: 1,
        //     },
        //     relations: ['attendees'],
        // });

        const event = await this.repository.findOne({
            where: { id: 1 },
            relations: ['attendees'],
        });

        // const event = new Event();
        // event.id = 1;

        const attendee = new Attendee();
        attendee.name = 'Gura';
        // attendee.event = event;

        event.attendees.push(attendee);

        // await this.attendeeRepository.save(attendee);
        await this.repository.save(event);

        return event;
    }

    @Get(':id')
    // 如果要傳入其他參數要使用new ParseIntPipe()如果沒有直接使用ParseIntPipe就可以
    // async findOne(@Param('id', new ParseIntPipe()) id) {
    async findOne(@Param('id', ParseIntPipe) id: number) {
        // const event = this.events.find((event) => event.id === +id);

        // const event = await this.repository.findOne({
        //     where: { id },
        // });

        const event = await this.eventsService.getEvent(id);

        if (!event) {
            throw new NotFoundException();
        }

        return event;
    }

    @Post()
    async create(@Body() input: CreateEventDto) {
        return await this.repository.save({
            ...input,
            when: new Date(input.when),
        });
    }

    @Patch(':id')
    async update(@Param('id') id, @Body() input: UpdateEventDto) {
        const event = await this.repository.findOne({
            where: { id },
        });

        if (!event) {
            throw new NotFoundException();
        }

        return await this.repository.save({
            ...event,
            ...input,
            when: input.when ? new Date(input.when) : event.when,
        });
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id) {
        const result = await this.eventsService.deleteEvent(id);

        if (result?.affected !== 1) {
            throw new NotFoundException();
        }
    }
}
