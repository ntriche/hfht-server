import { Injectable } from '@nestjs/common';
import { SubmissionsService } from 'src/mongoDB/submissions/submissions.service';
import { LoggerService } from '../logger/logger.service';
import { VoxPop } from './vox-pop.class';
import { Submission } from 'src/mongoDB/submissions/submissions.schema';

@Injectable()
export class VoxPopService {
	private enqueuedPosts: VoxPop[] = [];

	constructor(private readonly submissionsService: SubmissionsService, private log: LoggerService) { }

	// TODO: enqueue should make sure the post it is enqueuing hasn't already been posted by querying the DB
	// or maybe this should come later in the process to prevent slow down from disk operations
	// could query if posts are duplicates when the dashboard requests all posts in queue
	public enqueuePost(voxPop: VoxPop): number {
		const sub = voxPop.getMostRecentSubmission();

		this.log.info(`Enqueuing submission: "${sub}"`);

		// temporary
		const newSubmission: Submission = new Submission(voxPop);
		this.submissionsService.create(newSubmission);
		this.log.info(`Writing submission to DB`);

		return this.enqueuedPosts.push(voxPop);
	}

	public getEnqueuedSubmissions(): VoxPop[] {
		return this.enqueuedPosts;
	}

	processNewVoxPop(voxPop: VoxPop, trace: string): void {
		const newSubmission: Submission = new Submission(voxPop);
		try {
			trace += `Writing submission with the following content to DB: ${this.getStringSlice(voxPop.getMostRecentSubmission(), 32)} - `
			this.submissionsService.create(newSubmission);
		} catch {
			this.log.error(trace + "Failed to write submission to DB!");
		}
		this.log.info(trace + "Successfully wrote submission to DB");
	}

	getStringSlice(stringToBeSliced: string, maxLength: number): string {
		let stringCopy: string = stringToBeSliced;
		if (stringCopy.length > maxLength) {
			stringCopy = stringCopy.slice(0, maxLength) + '...';
		}
		return stringCopy;
	}

	// TODO: If I care about IP addresses, this regex needs work. This regular expression will give false positives.
	private ipv4_regex = /[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}/;
	public validateIPv4(userIP: string): boolean {
		return this.ipv4_regex.test(userIP);
	}

	public validateSubmissionLength(submission: string): string {
		if (submission.length < 1) { return "submission is too short (2 character minimum)"; }
		if (submission.length > 4096) { return "submission is too long (4096 character maximum)"; }
		return "";
	}
}
