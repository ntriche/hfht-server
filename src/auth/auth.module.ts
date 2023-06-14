import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/mongoDB/users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { LocalAuthGuard } from './local-auth.guard';

@Module({
	imports: [UsersModule, PassportModule],
	providers: [AuthService, LocalStrategy, LocalAuthGuard],
})
export class AuthModule {}
