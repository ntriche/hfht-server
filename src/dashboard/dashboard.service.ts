import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import { ReviewStatus, Submission, SubmissionDTO } from 'src/mongoDB/submissions/submissions.schema';
import { SubmissionsService } from 'src/mongoDB/submissions/submissions.service';
import { VoxPopService } from 'src/vox-pop/vox-pop.service';

@Injectable()
export class DashboardService {
	constructor(private voxPopService: VoxPopService, private readonly submissionsService: SubmissionsService, private log: LoggerService) {}

	getEnqueuedSubmissions(): string {
		const voxPops = this.voxPopService.getEnqueuedSubmissions();
		const msg = `Request received for enqueued submissions - `
		if (voxPops.length > 0) {
			this.log.info(msg + `returning ${voxPops.length} enqueued submissions`);
			return JSON.stringify(voxPops);
		}
		this.log.info(msg + `but no submissions are enqueued`);
		return 'There are no enqueued submissions.';
	}

	async getUnreviewedSubmissions(): Promise<string> {
		const msg = `Request received for un-reviewed submissions - `
		const reviewedSubmissions: Submission[] = await this.submissionsService.find({'reviewStatus': 0});
		if (reviewedSubmissions.length > 0) {
			this.log.info(msg + `returning ${reviewedSubmissions.length} un-reviewed submissions`);
			return JSON.stringify(reviewedSubmissions);
		}
		this.log.info(msg + `but no submissions are un-reviewed`);
		return 'There are no un-reviewed submissions.';
	}

	async handleReviewedSubmissions(submissions: SubmissionDTO[]): Promise<string> {
		if (!submissions) {
			this.log.info('Received invalid POST request to handle reviewed submissions.');
			throw new HttpException('Reviewed submissions are undefined, null, or generally fucked up', HttpStatus.BAD_REQUEST);
		}
		
		this.log.info('Request received to update reviewed submissions.')
		for (const sub of submissions) {
			if (sub.reviewStatus == ReviewStatus.NotReviewed) {
				this.log.info("Rejected submission review POST request - un-viewed submission received.");
				throw new HttpException('Un-reviewed submission received! Do not submit un-reviewed submissions!', HttpStatus.BAD_REQUEST)
			}
		
			if (sub.reviewStatus > 3) {
				this.log.info("Rejected submission review POST request - invalid review status received.");
				throw new HttpException('Invalid review status received', HttpStatus.BAD_REQUEST)
			}
		
			const db_sub: Submission = await this.submissionsService.findOne({'UUID':sub.UUID});
			if (!db_sub) {
				this.log.info("Rejected submission review POST request - could not find DB submission with UUID " + sub.UUID);
				throw new HttpException('Invalid UUID ' + sub.UUID, HttpStatus.BAD_REQUEST)
			}
			// TODO: add a check to confirm status override, which currently always occurs
			this.log.info(`Updating submission with UUID ${db_sub.UUID} and status ${db_sub.reviewStatus} to ${sub.reviewStatus}`)
			this.submissionsService.findOneAndUpdate({'UUID':sub.UUID}, {'reviewStatus': sub.reviewStatus});
		}

		return `Processed ${submissions.length} posts`;
	}
}