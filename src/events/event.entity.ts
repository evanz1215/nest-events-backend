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
import { Expose } from 'class-transformer';

// @Entity('event', { name: 'event' })
@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    @Expose()
    id: number;

    @Column()
    @Expose()
    name: string;

    @Column()
    @Expose()
    description: string;

    @Column()
    @Expose()
    when: Date;

    @Column()
    @Expose()
    address: string;

    @OneToMany(() => Attendee, (attendee) => attendee.event, {
        // eager:true
        cascade: ['insert', 'update'],
    })
    @Expose()
    attendees: Attendee[];

    @ManyToOne(() => User, (user) => user.organized)
    @JoinColumn({ name: 'organizerId' })
    @Expose()
    organizer: User;

    @Column({ nullable: true })
    organizerId: number;

    // 不需要加上@Column()因為不會被存到資料庫
    @Expose()
    attendeesCount?: number;
    @Expose()
    attendeeRejected?: number;
    @Expose()
    attendeeMaybe?: number;
    @Expose()
    attendeeAccepted?: number;
}
