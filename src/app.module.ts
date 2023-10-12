import { Module } from '@nestjs/common';
import { VoxPopModule } from './vox-pop/vox-pop.module';
import { HfhtLoggerService } from './logger/hfht.logger.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { TumblrModule } from './tumblr/tumblr.module';
import { HfhtLoggerModule } from './logger/hfht.logger.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks/tasks.service';

@Module({
	imports: [
		VoxPopModule, 
		SubmissionsModule, 
		UsersModule,
		AuthModule, 
		TumblrModule,
		HfhtLoggerModule,
		ThrottlerModule.forRoot([{
			ttl: 60,
			limit: 10,
		}]),
		ScheduleModule.forRoot(),
	],
	providers: [HfhtLoggerService, TasksService],
})
export class AppModule {}
