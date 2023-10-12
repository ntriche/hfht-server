import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { HfhtLoggerService } from 'src/logger/hfht.logger.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.schema';
import { AuthDTO } from './dto/auth.dto';
import { JWT_CONSTANTS } from 'env/security';

const saltRounds = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService, 
    private logger: HfhtLoggerService
  ) {
    this.logger.setContext(AuthService.name)
  }

  // local auth guard first calls validate in file local.strategy, which then calls this function
  // if successful, control goes back to the controller, which calls the login function underneath here
  async validateUser(username: string, plaintextPassword: string): Promise<any> {
    const user: User = await this.usersService.findOne( {'username':username} );
    if (user && await compare(plaintextPassword, user.password)) {
      const {password, ...result} = user;
      return result;
    }
    
    this.logger.warn(`User ${username} failed to authenticate.`)
    return null;
  }

  async login(authDTO: AuthDTO): Promise<object> {
    const payload = { 
      username: authDTO.username,
      sub: authDTO.username,
      iss: JWT_CONSTANTS.ISSUER,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async createHash(plaintextPassword: string): Promise<string> {
    if (!plaintextPassword) {
      throw new HttpException('String is falsy', HttpStatus.BAD_REQUEST);
    }
    return await hash(plaintextPassword, saltRounds);
  }
}