import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { UsersService } from '../mongoDB/users/users.service';
import { LoggerService } from 'src/logger/logger.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/mongoDB/users/user.schema';
import { AuthDTO } from './auth.controller';
import { jwtConstants } from './constants';

const saltRounds: number = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService, 
    private readonly log: LoggerService
  ) {}

  async validateUser(username: string, plaintextPassword: string): Promise<any> {
    const user: User = await this.usersService.findOne( {'username':username} );
    if (!!user && await compare(plaintextPassword, user.password)) {
      const {password, ...result} = user;
      return result;
    }
    
    this.log.info("User failed to authenticate.")
    return null;
  }

  async login(authDTO: AuthDTO): Promise<object> {
    const payload = { 
      username: authDTO.username,
      sub: authDTO.username,
      iss: jwtConstants.issuer,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async createHash(plaintextPassword: string): Promise<string> {
    if (!!!plaintextPassword) {
      throw new HttpException('String is falsy', HttpStatus.BAD_REQUEST);
    }
    return await hash(plaintextPassword, saltRounds);
  }
}