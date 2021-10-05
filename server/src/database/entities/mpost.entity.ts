import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToMany, Index } from 'typeorm';
import { Transform } from 'class-transformer';
import { User } from './user.entity';

/**
 * Multicolumn indexes
 * SELECT * FROM post WHERE "authorId" = 1 AND "categoryId" = 2
 *
 * CREATE INDEX post_authorId_columnId_index ON post ("authorId", "columnId");
 *
 * @Index(['postId', 'authorId'])
 *
 * Keep in mind that Postgres states in its documentation that multicolumn indexes should be used sparingly.
 * Usually, an index on a single column is enough,
 * and using more than three columns probably won’t be helpful.
 */
@Entity('mposts')
export class MPost {
	@PrimaryGeneratedColumn()
	public id: number;

	// foreign key reference
	@Column({ name: 'user_id', nullable: true })
	userId: number;

	@Column({ name: 'created' })
	public created: Date;

	@Column({ name: 'title' })
	public title: string;

	@Column({ name: 'content' })
	public content: string;

	@Column({ name: 'category', nullable: true })
	@Transform((value) => {
		if (value !== null) {
			return value;
		}
	})
	public category?: string;

	/**
	 * SELECT * FROM post WHERE "authorId" = 1;
	 * Improve query by creating an index
	 *
	 * CREATE INDEX post_authorId_index ON post ("authorId");
	 * TypeORM Decorator create this for us
	 */
	// @Index('post_authorId_index')
	@ManyToMany(() => User, (author: User) => author.posts)
	@JoinColumn({ name: 'user_id' })
	public author: User;
}
