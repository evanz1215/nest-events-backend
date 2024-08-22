import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
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
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from './input/create-event.dto';
import { UpdateEventDto } from './input/update-event.dto';
import { EventsService } from './events.service';
import { ListEvents } from './input/list.events';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { User } from 'src/auth/user.entity';

@Controller('/events')
export class EventsController {
    private readonly logger = new Logger(EventsController.name);

    constructor(private readonly eventsService: EventsService) {}

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

    @Get(':id')
    // 如果要傳入其他參數要使用new ParseIntPipe()如果沒有直接使用ParseIntPipe就可以
    // async findOne(@Param('id', new ParseIntPipe()) id) {
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const event = await this.eventsService.getEvent(id);

        if (!event) {
            throw new NotFoundException();
        }

        return event;
    }

    @Post()
    @UseGuards(AuthGuardJwt)
    async create(@Body() input: CreateEventDto, @CurrentUser() user) {
        return await this.eventsService.createEvent(input, user);
    }

    @Patch(':id')
    @UseGuards(AuthGuardJwt)
    async update(
        @Param('id') id,
        @Body() input: UpdateEventDto,
        @CurrentUser() user: User,
    ) {
        const event = await this.eventsService.getEvent(id);

        if (!event) {
            throw new NotFoundException();
        }

        if (event.organizerId !== user.id) {
            throw new ForbiddenException(
                null,
                `You are not the authorized to update this event`,
            );
        }

        return await this.eventsService.updateEvent(event, input);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(AuthGuardJwt)
    async remove(@Param('id') id, @CurrentUser() user: User) {
        const event = await this.eventsService.getEvent(id);

        if (!event) {
            throw new NotFoundException();
        }

        if (event.organizerId !== user.id) {
            throw new ForbiddenException(
                null,
                `You are not the authorized to remove this event`,
            );
        }

        await this.eventsService.deleteEvent(id);
    }
}
