import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { UsersService } from '../mongoDB/users/users.service';

const saltRounds: number = 10;

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async authenticateUser(username: string, plaintextPassword: string): Promise<any> {
    const user = await this.usersService.findOne({'username':username});
    if (await this.verifyPassword(plaintextPassword, user.password)) {
      const { password, ...result} = user;
      return result;
    }
    return false;
  }

  async verifyPassword(plaintextPassword: string, hashedPassword: string): Promise<boolean> {
    return await compare(plaintextPassword, hashedPassword);
  }

  async createHash(plaintextPassword: string): Promise<string> {
    return await hash(plaintextPassword, saltRounds);
  }
}
