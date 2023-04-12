import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Submission, SubmissionDocument } from './submissions.schema';

@Injectable()
export class SubmissionsService {
	constructor(@InjectModel(Submission.name) private submissionModel: Model<SubmissionDocument>) {}

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
		const newSubmission = new this.submissionModel(submission);
		return newSubmission.save();
	}
}
