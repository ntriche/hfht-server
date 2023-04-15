import { Injectable } from '@nestjs/common';
import { SubmissionsService } from 'src/mongoDB/submissions/submissions.service';
import { createClient, TumblrClient, TextPostParams } from 'tumblr-promises';
import { LoggerService } from '../logger/logger.service';
import { VoxPop } from './vox-pop.class';
import { Submission } from 'src/mongoDB/submissions/submissions.schema';

@Injectable()
export class VoxPopService {
	private tumblrClient: TumblrClient;
	private blogName: string = 'hfht-bot';
	private blogURL: string = 'https://hfht-bot.tumblr.com/';
	private enqueuedPosts: VoxPop[] = [];

	constructor(private readonly submissionsService: SubmissionsService, private log: LoggerService) {
		this.tumblrClient = this.createTumblrClient();
		// Write to the console the blog we authenticated to just to confirm we've successfully authenticated
		this.tumblrClient.userInfo(function (err, data) {
			if (!!data) {
				data.user.blogs.forEach(function (blog) {
					log.write('Successfully authenticated to ' + blog.name);
				});
			}

			if (!!err) {
				log.error('Failed to authenticate to Tumblr API');
			}
		});
	}

	createTumblrClient(): TumblrClient {
		const tumblrClient = createClient({
			credentials: {
				consumer_key: process.env.CONSUMER_KEY,
				consumer_secret: process.env.CONSUMER_SECRET,
				token: process.env.TOKEN,
				token_secret: process.env.TOKEN_SECRET,
			},
			returnPromises: true,
		});
		return tumblrClient;
	}

	// Arguments needs to be changed to accept (probably) a UUID
	public async createTumblrPost(voxPop: VoxPop): Promise<string> {
		// Query for submission using UUID and then use that result to make the post
		const sub = voxPop.getMostRecentSubmission();
		let html = '<span>' + this.createChanTimestamp(voxPop.timestamp) + '</span>\n<div>' + sub + '</div>\n';
		const params = { body: html } as TextPostParams;

		let postID = '';
		await this.tumblrClient
			.createTextPostWithPromise(this.blogName, params)
			.then((data) => {
				if (!!data.id_string) {
					postID = data.id_string;
					this.log.write('Created post with UUID ' + voxPop.UUID + ' and post ID of ' + postID);
				} else {
					this.log.error('Something went wrong for post with UUID "' + voxPop.UUID + '"');
				}
			})
			.catch((err) => console.log(err));

		// Update this to find submission that was posted and add the postID
		//await this.submissionsService.findOneAndUpdate().catch((err) => console.log(err));

		return postID;
	}

	// TODO: enqueue should make sure the post it is enqueuing hasn't already been posted by querying the DB
	// or maybe this should come later in the process to prevent slow down from disk operations
	// could query if posts are duplicates when the dashboard requests all posts in queue
	public enqueuePost(voxPop: VoxPop): number {
		let sub = voxPop.getMostRecentSubmission();

		this.log.write(`Enqueuing submission: "${sub}"`);

		// temporary
		const newSubmission: Submission = new Submission(voxPop);
		this.submissionsService.create(newSubmission);
		this.log.write(`Writing submission to DB`);

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
		this.log.write(trace + "Successfully wrote submission to DB");
	}

	getStringSlice(stringToBeSliced: string, maxLength: number): string {
		let stringCopy: string = stringToBeSliced;
		if (stringCopy.length > maxLength) {
			stringCopy = stringCopy.slice(0, maxLength) + '...';
		}
		return stringCopy;
	}

	createChanTimestamp(date: Date): string {
		if (!(date instanceof Date)) {
			date = new Date(date);
		}
		const localeDate = date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'numeric', year: '2-digit' }).split(',');
		return localeDate[1].trimStart() + '(' + localeDate[0] + ')' + date.toLocaleTimeString('en-GB');
	}

	getBlogName(): string {
		return this.blogName;
	}

	getBlogURL(): string {
		return this.blogURL;
	}

	// TODO: If I care about IP addresses, this regex needs work. This regular expression will give false positives.
	private ipv4_regex: RegExp = /[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}/;
	public validateIPv4(userIP: string): boolean {
		return this.ipv4_regex.test(userIP);
	}

	public validateSubmissionLength(submission: string): string {
		if (submission.length < 1) { return "submission is too short (2 character minimum)"; }
		if (submission.length > 4096) { return "submission is too long (4096 character maximum)"; }
		return "";
	}
}
