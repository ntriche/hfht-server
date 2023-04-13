import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	async find(query: FilterQuery<User>): Promise<User[]> {
		return this.userModel.find(query);
	}

	async findOne(query: FilterQuery<User>): Promise<User> {
		return this.userModel.findOne(query);
	}
}
