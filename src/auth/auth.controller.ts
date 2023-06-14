import { Body, Controller, HttpException, HttpStatus, Post, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';

class AuthDTO {
	username: string;
	password: string;
}

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@HttpCode(HttpStatus.OK)
  	@Post('login')
	async login(@Body() authDTO: AuthDTO): Promise<string> {
		if (!!!authDTO.username || !!!authDTO.password) { throw new HttpException('Username or password is formatted incorrectly or missing', HttpStatus.BAD_REQUEST) }
		return await this.authService.validateUser(authDTO.username, authDTO.password);
	}

	@Post('hash')
	async hash(@Body() plaintextPassword: string): Promise<string> {
		return await this.authService.createHash(plaintextPassword);
	}
}