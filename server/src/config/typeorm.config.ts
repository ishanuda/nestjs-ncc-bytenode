import { User } from '../database/entities/user.entity';
import { Address } from '../database/entities/adress.entity';
import { MPost } from '../database/entities/mpost.entity';

export default () => ({
	database: {
		type: 'sqlite', // process.env.ORM_TYPE, // 'sqlite',
		// host: process.env.TYPEORM_HOST,
		// username: process.env.TYPEORM_USERNAME,
		// password: process.env.TYPEORM_PASSWORD,
		database: 'db/test.db', // process.env.ORM_DATABASE,
		// port: parseInt(process.env.TYPEORM_PORT),
		// entities: process.env.TYPEORM_ENTITIES.split(','),
		// entities: [process.cwd() + process.env.ORM_ENTITIES],
		entities: [User, Address, MPost],
		autoLoadEntities: false, // process.env.ORM_AUTO_LOAD_ENTITIES === 'true',
		// migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN === 'true',
		dropSchema: false, // process.env.ORM_DROP_SCHEMA === 'true',
		synchronize: true, // process.env.ORM_SYNCHRONIZE === 'true',
		logging: false, // process.env.TYPEORM_LOGGING === 'true',
	},
});
