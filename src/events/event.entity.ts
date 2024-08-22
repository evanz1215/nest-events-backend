import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Attendee } from './attendee.entity';
import { User } from 'src/auth/user.entity';

// @Entity('event', { name: 'event' })
@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    when: Date;

    @Column()
    address: string;

    @OneToMany(() => Attendee, (attendee) => attendee.event, {
        // eager:true
        cascade: ['insert', 'update'],
    })
    attendees: Attendee[];

    @ManyToOne(() => User, (user) => user.organized)
    @JoinColumn({ name: 'organizerId' })
    organizer: User;

    @Column({ nullable: true })
    organizerId: number;

    // 不需要加上@Column()因為不會被存到資料庫
    attendeesCount?: number;
    attendeeRejected?: number;
    attendeeMaybe?: number;
    attendeeAccepted?: number;
}
