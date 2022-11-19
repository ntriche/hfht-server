import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { VoxPopModule } from './vox-pop/vox-pop.module';
import { LoggerService } from './logger/logger.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from './posts/posts.module';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';
import { ValidationMiddleware } from './middleware/validation.middleware';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [VoxPopModule, PostsModule, MongooseModule.forRoot('mongodb://localhost:27017/vox-pop'), DashboardModule, AuthModule, UsersModule],
  providers: [LoggerService, DashboardService],
  controllers: [DashboardController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidationMiddleware)
      .forRoutes({path: 'vox-pop', method: RequestMethod.POST});
  }
}
