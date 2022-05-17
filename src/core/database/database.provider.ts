import { Sequelize } from 'sequelize-typescript';
import { Post } from 'src/modules/posts/post.entity';
import { User } from 'src/modules/users/user.entity';
import { DEVELOPMENT, PRODUCTION, SEQUELIZE, TEST } from '../constants';
import { databaseConfig } from './database.config';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;

        case TEST:
          config = databaseConfig.test;
          break;

        case PRODUCTION:
          config = databaseConfig.production;
          break;

        default:
          config = databaseConfig.development;
          break;
      }

      const sequelize = new Sequelize(config);
      sequelize.addModels([User, Post]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
