import { Module } from '@nestjs/common';
import { VoxPopModule } from './vox-pop/vox-pop.module';
import { LoggerService } from './logger/logger.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { TumblrModule } from './tumblr/tumblr.module';
import { LoggerModule } from './logger/logger.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
	imports: [
		VoxPopModule, 
		SubmissionsModule, 
		UsersModule,
		AuthModule, 
		TumblrModule,
		LoggerModule,
		MongooseModule.forRoot('mongodb://127.0.0.1:27017/hfht'),
		ThrottlerModule.forRoot([{
			ttl: 60,
			limit: 10,
		}]),
	],
	providers: [LoggerService],
})
export class AppModule {}
