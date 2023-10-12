import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './guards/local.strategy';
import { JwtStrategy } from './guards/jwt.strategy';
import { JWT_CONSTANTS } from 'env/security';
import { HfhtLoggerModule } from 'src/logger/hfht.logger.module';

@Module({
	imports: [
		HfhtLoggerModule,
		UsersModule, 
		PassportModule, 
		JwtModule.register({
			secret: JWT_CONSTANTS.SECRET,
			signOptions: { expiresIn: JWT_CONSTANTS.EXPIRY_TIME },
		}),
	],
	providers: [AuthService, LocalStrategy, JwtStrategy],
	controllers: [AuthController],
	exports: [AuthService],
})
export class AuthModule {}
