import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Submission, SubmissionDocument } from './submissions.schema';

@Injectable()
export class SubmissionsService {
	constructor(@InjectModel(Submission.name) private submissionModel: Model<SubmissionDocument>) {}

	getDocument(submission: Submission): SubmissionDocument {
		return new this.submissionModel(submission);
	}

	async find(query: FilterQuery<Submission>): Promise<Submission[]> {
		return this.submissionModel.find(query);
	}

	async findOne(query: FilterQuery<Submission>): Promise<Submission> {
		return this.submissionModel.findOne(query);
	}

	async findOneAndUpdate(query: FilterQuery<Submission>, submission: Partial<Submission>): Promise<Submission> {
		return this.submissionModel.findOneAndUpdate(query, submission);
	}

	async create(submission: Submission): Promise<Submission> {
		return this.getDocument(submission).save();
	}

	// TODO: this doesn't work, find out why
	// async updateOne(submission: Submission, query: FilterQuery<Submission>, update: UpdateQuery<Submission>): Promise<Submission> {
	// 	return this.getDocument(submission).updateOne(query, update)
	// }
}