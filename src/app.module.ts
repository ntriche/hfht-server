import { Module } from '@nestjs/common';
import { VoxPopModule } from './vox-pop/vox-pop.module';
import { LoggerService } from './logger/logger.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './mongoDB/users/users.module';
import { SubmissionsModule } from './mongoDB/submissions/submissions.module';
import { TumblrModule } from './tumblr/tumblr.module';
import { LoggerModule } from './logger/logger.module';

@Module({
	imports: [VoxPopModule, SubmissionsModule, UsersModule, DashboardModule, AuthModule, TumblrModule, MongooseModule.forRoot('mongodb://127.0.0.1:27017/hfht'), LoggerModule],
	providers: [LoggerService, DashboardService],
	controllers: [DashboardController],
})
export class AppModule {}
