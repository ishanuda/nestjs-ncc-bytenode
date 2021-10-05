import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from 'typeorm';
import { Expose } from 'class-transformer';
import { User } from './user.entity';

@Entity('address')
export class Address {
	@PrimaryGeneratedColumn()
	id: number;

	// foreign key reference
	@Column({ name: 'user_id', nullable: true })
	userId: number;

	@Column({ name: 'created' })
	@Expose()
	created: Date;

	@Column({ name: 'street' })
	@Expose()
	public street: string;

	@Column({ name: 'city' })
	@Expose()
	public city: string;

	@Column({ name: 'country' })
	@Expose()
	public country: string;

	// Inverse relationship
	// Creating this relationship makes the link bidirectional
	@OneToOne(() => User, (user: User) => user.address)
	@JoinColumn({ name: 'user_id' })
	public user: User;
}
