import { Repository, EntityRepository } from 'typeorm';
import { User } from '../../database';

@EntityRepository(User)
export class UserRepository extends Repository<User> {}
