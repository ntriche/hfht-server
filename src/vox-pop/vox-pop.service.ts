import { Injectable } from '@nestjs/common';
import { PostsService } from 'src/posts/posts.service';
import { Post } from 'src/posts/post.schema';
import { createClient, TumblrClient, TextPostParams } from 'tumblr-promises';
import { LoggerService } from '../logger/logger.service';
import { VoxPop } from './vox-pop.class';

@Injectable()
export class VoxPopService {
	private tumblrClient: TumblrClient;
	private blogName: string = 'hfht-bot';
	private blogURL: string = 'https://hfht-bot.tumblr.com/';
	private enqueuedPosts: VoxPop[] = [];

	constructor(private readonly postsService: PostsService, private log: LoggerService) {
		this.tumblrClient = this.createTumblrClient();
		// Write to the console the blog we authenticated to just to confirm we've successfully authenticated
		if (!!this.tumblrClient) {
			this.tumblrClient.userInfo(function (err, data) {
				if (!!data) {
					data.user.blogs.forEach(function (blog) {
						log.write('Successfully authenticated to ' + blog.name);
					});
				}
			});
		}
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

	public async createTumblrPost(voxPop: VoxPop): Promise<string> {
		const sub = voxPop.getMostRecentSubmission();
		let html = '<span>' + this.createChanTimestamp(voxPop.timestampAtSubmission) + '</span>\n<div>' + sub + '</div>\n';

		const params = { body: html } as TextPostParams;
		await this.tumblrClient
			.createTextPostWithPromise(this.blogName, params)
			.then((data) => {
				if (!!data.id_string) {
					voxPop.postID = data.id_string;
					this.log.write('Created post with UUID ' + voxPop.UUID + ' and post ID of ' + voxPop.postID);
				} else {
					this.log.error('Something went wrong for post with UUID "' + voxPop.UUID + '"');
				}
			})
			.catch((err) => console.log(err));

		const newPost = new Post(voxPop);
		await this.postsService.create(newPost).catch((err) => console.log(err));

		return voxPop.postID;
	}

	// TODO: enqueue should make sure the post it is enqueuing hasn't already been posted by querying the DB
	// or maybe this should come later in the process to prevent slow down from disk operations
	// could query if posts are duplicates when the dashboard requests all posts in queue
	public enqueuePost(voxPop: VoxPop): number {
		let sub = voxPop.getMostRecentSubmission();
		if (sub.length > 32) {
			sub = sub.slice(0, 32) + '...';
		}
		this.log.write(`Enqueuing post: "${sub}"`);
		return this.enqueuedPosts.push(voxPop);
	}

	public createChanTimestamp(date: Date): string {
		if (!(date instanceof Date)) {
			date = new Date(date);
		}
		const localeDate = date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'numeric', year: '2-digit' }).split(',');
		return localeDate[1].trimStart() + '(' + localeDate[0] + ')' + date.toLocaleTimeString('en-GB');
	}

	public getBlogName(): string {
		return this.blogName;
	}

	public getBlogURL(): string {
		return this.blogURL;
	}

	public getEnqueuedPosts(): VoxPop[] {
		return this.enqueuedPosts;
	}

	// TODO: should also delete from the DB, or posts in the DB should have a flag to mark if they have been deleted from the blog
	// TODO: check and ensure if this needs a new method written in tumblr.d.ts to use promises instead of callbacks
	// deleteTumblrPost(postID: string): void {
	//   const params = {id: postID} as Object
	//   VoxPopService.tumblrClient.deletePost(this.blogName, params, function(err, data) {
	//     if (err !== null) {
	//       console.log(`Failed to delete text post - ${err}`)
	//       return;
	//     }
	//     console.log(`Successfully deleted post with ID ${postID}`);
	//   });
	//   return;
	// }
}
