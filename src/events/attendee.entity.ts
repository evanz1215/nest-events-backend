import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Event } from './event.entity';

@Entity()
export class Attendee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
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
}
