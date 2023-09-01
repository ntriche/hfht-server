import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/mongoDB/users/users.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './guards/local.strategy';
import { JwtStrategy } from './guards/jwt.strategy';

@Module({
	imports: [
		UsersModule, 
		PassportModule, 
		JwtModule.register({
			secret: jwtConstants.secret,
			signOptions: { expiresIn: jwtConstants.expiryTime },
		}),
	],
	providers: [AuthService, LocalStrategy, JwtStrategy],
	controllers: [AuthController],
	exports: [AuthService],
})
export class AuthModule {}
