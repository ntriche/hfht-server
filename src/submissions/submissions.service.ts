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

	async handleReview(submissions: SubmissionDTO[]): Promise<SubmissionResponse> {
		if (!submissions) {
			this.log.info('Received invalid POST request to handle reviewed submissions.');
			throw new HttpException('Reviewed submissions are undefined, null, or generally fucked up', HttpStatus.BAD_REQUEST);
		}
		
		this.log.info(`Request received to update ${submissions.length} reviewed submissions.`)
		// TODO: consider if I really want this to fail completely if a single reviewed submission is rejected
		// for now it's kind of a good check that everything is working as intended
		let updated: number = 0;
		let updateInfo: submissionUpdateInfo[] = new Array<submissionUpdateInfo>;
		for (const reviewed_sub of submissions) {
			if (reviewed_sub.reviewStatus == ReviewStatus.Unreviewed) {
				this.log.info("Rejected submission review POST request - un-viewed submission received.");
				throw new HttpException('Un-reviewed submission received! Do not submit un-reviewed submissions!', HttpStatus.BAD_REQUEST)
			}
		
			if (reviewed_sub.reviewStatus > 3) {
				this.log.info("Rejected submission review POST request - invalid review status received.");
				throw new HttpException('Invalid review status received', HttpStatus.BAD_REQUEST)
			}
		
			const db_sub: Submission = await this.findOne({'UUID':reviewed_sub.UUID});
			if (!db_sub) {
				this.log.info("Rejected submission review POST request - could not find DB submission with UUID " + reviewed_sub.UUID);
				throw new HttpException('Invalid UUID ' + reviewed_sub.UUID, HttpStatus.BAD_REQUEST)
			}

			// TODO: add a check to confirm status override, which currently always occurs
			if (reviewed_sub.reviewStatus != db_sub.reviewStatus) {
				this.findOneAndUpdate({'UUID':reviewed_sub.UUID}, {'reviewStatus': reviewed_sub.reviewStatus});
				updated++;
			}

			updateInfo.push({
				UUID: db_sub.UUID,
				oldStatus: db_sub.reviewStatus,
				newStatus: reviewed_sub.reviewStatus
			});
		}

		const msg: string = `Processed ${updateInfo.length}, updated ${updated}`;
		this.log.info(msg)
		return {
			msg: msg,
			info: updateInfo, 
		};
	}

	async deleteOne(uuid: string): Promise<any> {
		return await this.submissionModel.deleteOne({'UUID':uuid});
	}

	async deleteMany(query: FilterQuery<Submission>): Promise<any> {
		return await this.submissionModel.deleteMany(query);
	}
}