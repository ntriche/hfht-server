import { Body, Controller, Post, UseGuards, Get, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth-guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthDTO } from './dto/auth.dto';

// This DTO is a little dumb, but Nest doesn't like to read plaintext in a POST request, so the alternative is to parse the raw request body
class HashDTO {
	plaintextPassword: string;
}

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService
	) {}

	@Post('login')
	@HttpCode(200)
	@UseGuards(LocalAuthGuard)
	async login(@Body() authDTO: AuthDTO): Promise<object> {
		return await this.authService.login(authDTO);
	}

	@Post('hash')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async hash(@Body() hashDTO: HashDTO): Promise<string> {
		return await this.authService.createHash(hashDTO.plaintextPassword);
	}

	@Get('test')
	@UseGuards(JwtAuthGuard)
	tokenTest(): string {
		return 'Token successfully authenticated!';
	}
}