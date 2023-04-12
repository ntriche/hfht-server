import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Rejection, RejectionDocument } from './rejections.schema';

@Injectable()
export class RejectionsService {
	constructor(@InjectModel(Rejection.name) private rejectionModel: Model<RejectionDocument>) {}

	async find(query: FilterQuery<Rejection>): Promise<Rejection[]> {
		return this.rejectionModel.find(query);
	}

	async findOne(query: FilterQuery<Rejection>): Promise<Rejection> {
		return this.rejectionModel.findOne(query);
	}

	async findOneAndUpdate(query: FilterQuery<Rejection>, rejection: Partial<Rejection>): Promise<Rejection> {
		return this.rejectionModel.findOneAndUpdate(query, rejection);
	}

	async create(rejection: Rejection): Promise<Rejection> {
		const newRejection = new this.rejectionModel(rejection);
		return newRejection.save();
	}
}
