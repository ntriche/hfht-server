import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { VoxPopModule } from './vox-pop/vox-pop.module';
import { LoggerService } from './logger/logger.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';
import { ValidationMiddleware } from './middleware/validation.middleware';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './mongoDB/users/users.module';
import { SubmissionsModule } from './mongoDB/submissions/submissions.module';

@Module({
	imports: [VoxPopModule, SubmissionsModule, UsersModule, DashboardModule, AuthModule, MongooseModule.forRoot('mongodb://127.0.0.1:27017/hfht')],
	providers: [LoggerService, DashboardService],
	controllers: [DashboardController],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(ValidationMiddleware).forRoutes({ path: 'vox-pop', method: RequestMethod.POST });
	}
}
