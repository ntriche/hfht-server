import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import { ReviewStatus, Submission } from 'src/mongoDB/submissions/submissions.schema';
import { SubmissionsService } from 'src/mongoDB/submissions/submissions.service';
import { VoxPopService } from 'src/vox-pop/vox-pop.service';

@Injectable()
export class DashboardService {
	constructor(private voxPopService: VoxPopService, private readonly submissionsService: SubmissionsService, private log: LoggerService) {}

	getEnqueuedSubmissions(): string {
		const voxPops = this.voxPopService.getEnqueuedSubmissions();
		let msg = `Request received for enqueued submissions - `
		if (voxPops.length > 0) {
			this.log.write(msg + `returning ${voxPops.length} enqueued submissions`);
			return JSON.stringify(voxPops);
		}
		this.log.write(msg + `but no submissions are enqueued`);
		return 'There are no enqueued submissions.';
	}

	async getUnreviewedSubmissions(): Promise<string> {
		let msg = `Request received for un-reviewed submissions - `
		const reviewedSubmissions = await this.submissionsService.find({'reviewStatus': 0});
		if (reviewedSubmissions.length > 0) {
			this.log.write(msg + `returning ${reviewedSubmissions.length} un-reviewed submissions`);
			return JSON.stringify(reviewedSubmissions);
		}
		this.log.write(msg + `but no submissions are un-reviewed`);
		return 'There are no un-reviewed submissions.';
	}

	async handleReviewedSubmissions(submissions: Submission[]): Promise<string> {
		try {
			submissions.forEach(async sub => {
				switch (sub.reviewStatus) {
					// This shit shouldn't be here
					case ReviewStatus.NotReviewed:
						throw new HttpException('Un-reviewed submission received! Do not submit un-reviewed submissions!', 400)
					case ReviewStatus.Denied:
						await this.submissionsService.findOneAndUpdate({'UUID':sub.UUID}, {'reviewStatus':1})
						break;
					case ReviewStatus.Approved:
						await this.submissionsService.findOneAndUpdate({'UUID':sub.UUID}, {'reviewStatus':2})
						//  enqueue
						break;
					case ReviewStatus.SuperApproved:
						await this.submissionsService.findOneAndUpdate({'UUID':sub.UUID}, {'reviewStatus':3})
						// post immediately
						break;
					default:
						throw new HttpException('Submission with an invalid post-status received!', 400)
				}
	
			});
		} catch {
			console.log('hi');
		}

		return HttpStatus.OK.toString();
	}
}
