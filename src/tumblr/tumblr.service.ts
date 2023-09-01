import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import { VoxPop } from 'src/vox-pop/vox-pop.class';
import { CONSUMER_KEY, CONSUMER_SECRET, TOKEN, TOKEN_SECRET } from 'env';

@Injectable()
export class TumblrService {
	// private tumblrClient: TumblrClient;
	// private blogName: string = 'hfht-bot';
	// private blogURL: string = 'https://hfht-bot.tumblr.com/';
    // private initialized: boolean = false;

    // constructor(private log: LoggerService) { }

    // public initializeTumblr(): boolean {
    //     this.tumblrClient = this.createTumblrClient();

	// 	this.tumblrClient.userInfo(function (err, data) {
	// 		if (!!data) {
	// 			data.user.blogs.forEach(function (blog) {
	// 				this.log.write('Successfully authenticated to ' + blog.name);
    //                 this.initialized = true;
	// 			});
	// 		}

	// 		if (!!err) {
	// 			this.log.error('Failed to authenticate to Tumblr API');
	// 		}
	// 	});

    //     return this.initialized;
    // }

	// createTumblrClient(): TumblrClient {
	// 	const tumblrClient = createClient({
	// 		credentials: {
	// 			consumer_key: CONSUMER_KEY,
	// 			consumer_secret: CONSUMER_SECRET,
	// 			token: TOKEN,
	// 			token_secret: TOKEN_SECRET,
	// 		},
	// 		returnPromises: true,
	// 	});

	// 	return tumblrClient;
	// }

	// // Arguments needs to be changed to accept (probably) a UUID
	// public async createTumblrPost(voxPop: VoxPop | undefined, UUID: string | undefined): Promise<string> {
	// 	// Query for submission using UUID and then use that result to make the post
	// 	const sub = voxPop.getMostRecentSubmission();
	// 	let html = '<span>' + this.createChanTimestamp(voxPop.timestamp) + '</span>\n<div>' + sub + '</div>\n';
	// 	const params = { body: html } as TextPostParams;

	// 	let postID = '';
	// 	await this.tumblrClient
	// 		.createTextPostWithPromise(this.blogName, params)
	// 		.then((data) => {
	// 			if (!!data.id_string) {
	// 				postID = data.id_string;
	// 				this.log.write('Created post with UUID ' + voxPop.UUID + ' and post ID of ' + postID);
	// 			} else {
	// 				this.log.error('Something went wrong for post with UUID "' + voxPop.UUID + '"');
	// 			}
	// 		})
	// 		.catch((err) => console.log(err));

	// 	// Update this to find submission that was posted and add the postID
	// 	//await this.submissionsService.findOneAndUpdate().catch((err) => console.log(err));

	// 	return postID;
	// }

	// private createChanTimestamp(date: Date): string {
	// 	if (!(date instanceof Date)) {
	// 		date = new Date(date);
	// 	}
	// 	const localeDate = date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'numeric', year: '2-digit' }).split(',');
	// 	return localeDate[1].trimStart() + '(' + localeDate[0] + ')' + date.toLocaleTimeString('en-GB');
	// }
}