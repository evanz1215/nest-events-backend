import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventsController } from './events.controller';
import { Attendee } from './attendee.entity';
import { EventsService } from './events.service';

// static module
@Module({
    imports: [TypeOrmModule.forFeature([Event, Attendee])],
    controllers: [EventsController],
    providers: [EventsService],
})
export class EventsModule {}
