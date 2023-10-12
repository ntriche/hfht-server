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
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
	imports: [
		VoxPopModule, 
		SubmissionsModule, 
		UsersModule,
		AuthModule, 
		TumblrModule,
		HfhtLoggerModule,
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				uri: `${configService.get<string>('DATABASE_URL')}`,
			}),
			inject: [ConfigService],
		}),
		ThrottlerModule.forRoot([{
			ttl: 60,
			limit: 10,
		}]),
		ScheduleModule.forRoot(),
		ConfigModule.forRoot({
			envFilePath: ['env/local.env', 'env/development.env', 'production.env'],
			isGlobal: true
		})
	],
	providers: [HfhtLoggerService, TasksService],
})
export class AppModule {}
