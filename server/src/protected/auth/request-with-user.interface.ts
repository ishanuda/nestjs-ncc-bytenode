import { Request } from 'express';
import { User } from '../../database';

export interface RequestWithUser extends Request {
	user: User;
}
