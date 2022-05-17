import { USER_REPOSIROTY } from 'src/core/constants';
import { User } from './user.entity';

export const usersProviders = [
  {
    provide: USER_REPOSIROTY,
    useValue: User,
  },
];
