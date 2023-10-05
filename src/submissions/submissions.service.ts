import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Submission, SubmissionDocument } from './submissions.schema';
import { SubmissionDTO } from './dto/submission.dto';
import { ReviewStatus } from './submission.enums';
import { LoggerService } from 'src/logger/logger.service';

export class SubmissionResponse {
	msg: string;
	info: submissionUpdateInfo[];
}

interface submissionUpdateInfo {
	UUID: string;
	oldStatus: number;
	newStatus: number;
}

@Injectable()
export class SubmissionsService {
	constructor(
		@InjectModel(Submission.name) 
		private submissionModel: Model<SubmissionDocument>,
		private readonly log: LoggerService
	) {}

	async create(newSubmission: SubmissionDTO): Promise<Submission> {
		this.log.info(`Saving submission to DB`)
		const createdSubmission = new this.submissionModel(newSubmission);
		return createdSubmission.save();
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

	async getSubmissions(type: ReviewStatus): Promise<Submission[]> {
		const msg = `Request received for ${(type == null) ? 'all' : ReviewStatus[type]} submissions - `

		let query: FilterQuery<Submission> = {};
		if (type in ReviewStatus) {
			query = {'reviewStatus': type}
		}

		const reviewedSubmissions: Submission[] = await this.find(query);
		if (reviewedSubmissions.length > 0) {
			this.log.info(msg + `returning ${reviewedSubmissions.length} submissions`);
			return reviewedSubmissions;
		}

		this.log.info(msg + `but no submissions were found.`);
		throw new HttpException(`No valid submissions available`, HttpStatus.NOT_FOUND);
	}

	async updateMany(reviewedSubmissions: ReviewDTO): Promise<SubmissionResponse> {
		//this.log.info(`Request received to update ${reviewedSubmissions.length} reviewed submissions.`)
		
		//for (const reviewedSub of reviewedSubmissions) {
			// const databaseSub: Submission = await this.findOne({'UUID': reviewedSub.UUID});
			// if (!databaseSub) {
			// 	this.log.info("Rejected submission update request - could not find DB submission with UUID " + reviewedSub.UUID);
			// 	throw new HttpException('Invalid UUID ' + reviewedSub.UUID, HttpStatus.BAD_REQUEST)
			// }
		//}

		return {
			msg: 'lol',
			info: null
		};
	}

	async deleteOne(uuid: string): Promise<any> {
		return await this.submissionModel.deleteOne({'UUID':uuid});
	}

	async deleteMany(query: FilterQuery<Submission>): Promise<any> {
		return await this.submissionModel.deleteMany(query);
	}
}