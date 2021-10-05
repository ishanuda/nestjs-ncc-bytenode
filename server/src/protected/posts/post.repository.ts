import { Repository, EntityRepository } from 'typeorm';
import { MPost } from '../../database';

@EntityRepository(MPost)
export class PostRepository extends Repository<MPost> {}
