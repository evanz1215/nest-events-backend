import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { Expose } from 'class-transformer';

export enum AttendeeAnswerEnum {
    Accepted = 1,
    Maybe,
    Rejected,
}

@Entity()
export class Attendee {
    @PrimaryGeneratedColumn()
    @Expose()
    id: number;

    @Column()
    @Expose()
    name: string;

    @ManyToOne(() => Event, (event) => event.attendees, {
        nullable: false,
    })
    // JoinColumn預設會啟用，使用JoinColumn可以自定義名稱等
    // @JoinColumn({
    //     name: 'event_id',
    // })
    @JoinColumn()
    event: Event;

    @Column('enum', {
        enum: AttendeeAnswerEnum,
        default: AttendeeAnswerEnum.Accepted,
    })
    @Expose()
    answer: AttendeeAnswerEnum;
}
