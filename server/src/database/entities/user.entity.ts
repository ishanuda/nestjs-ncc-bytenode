import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Address } from './adress.entity';
import { MPost } from './mpost.entity';

@Entity('user')
export class User {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ name: 'created' })
	@Expose()
	public created: Date;

	@Column({ name: 'name' })
	@Expose()
	public name: string;

	@Column({ name: 'email', unique: true })
	@Expose()
	public email: string;

	@Column({ name: 'password' })
	@Exclude()
	public password: string;

	@Column({ name: 'phone_number' })
	@Expose()
	public phoneNumber: string;

	@Column({ name: 'refresh_token', nullable: true })
	@Exclude()
	public refreshToken: string;

	// One To One relationship
	// Creating this relationship only make the link unidirectional
	@OneToOne(() => Address, {
		eager: false, // Setting true the related entities always be included
		cascade: true, // Setting true the Address can be saved along with the user
	})
	@JoinColumn()
	public address: Address;

	@OneToMany(() => MPost, (post: MPost) => post.author)
	public posts: MPost[];
}
