import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigMoudle } from '@nestjs/config';
import { GraphQLMoudle } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
	  ConfigMoudle.forRoot({
		  isGlobal: true,
		  validationSchema: Joi.object({
			  NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required()
		  })
	  }),
	  TypeOrmModule.forRoot({
		  type: 'postgres',
		  host: 'localhost',
		  port: 5432,
		  username: 'andy',
		  password: '12345',
		  database: 'slack',
		  synchronize: true,
		  logging: true,
		  entities: [ __dirname + '/../**/*.entity.ts'],
	  })
	  GraphQLMoudle.forRoot({
		  installSubscriptionHandlers: true,
		  autoSchemaFile: true,
	  })
	  UsersModule,
	  CommonModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
