import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/user.schema';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, plaintextPassword: string): Promise<any> {
    const user: User = await this.authService.validateUser(username, plaintextPassword);
    if (!user) { 
      throw new UnauthorizedException(); 
    }
    return user;
  }
}