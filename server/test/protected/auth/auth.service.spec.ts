
import { ConfigService  } from '@nestjs/config';
import { Repository  } from 'typeorm';
import { JwtService  } from '@nestjs/jwt';

import { User } from '../../../src/database/entities';
import { AuthService } from '../../../src/protected/auth/auth.service';
import { UsersService } from '../../../src/protected/users/users.service';

describe('The AuthService', () => {
    const authService = new AuthService(
        new UsersService(
            new Repository<User>()
        ),
        new JwtService({
            secretOrPrivateKey: '123456',
        }),
        new ConfigService()
    );

    describe('when creating a cookie', () => {
        it('should return a string', () => {
            const userId = 1;
            expect(
                typeof authService.getCookieWithJwtToken(userId)
            ).toEqual('string')
        })
    });
});
