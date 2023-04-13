import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import { Post } from 'src/mongoDB/posts/post.schema';
import { PostsService } from 'src/mongoDB/posts/posts.service';
import { RejectionsService } from 'src/mongoDB/rejections/rejections.service';
import { SubmissionsService } from 'src/mongoDB/submissions/submissions.service';
import { VoxPop } from 'src/vox-pop/vox-pop.class';
import { VoxError } from 'src/vox-pop/vox-pop.controller';
import { VoxPopService } from 'src/vox-pop/vox-pop.service';

enum ReviewStatus {
	NotReviewed = 0,
	Denied,
	Approved,
	SuperApproved,
  }
export interface ReviewedSubmissionDTO {
	status: ReviewStatus,
	pop: VoxPop,
	edit: string,
}

@Injectable()
export class DashboardService {
	constructor(private voxPopService: VoxPopService, private readonly postsService: PostsService, private readonly submissionsService: SubmissionsService, private readonly rejectionsService: RejectionsService, private log: LoggerService) {}

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

	handleReviewedSubmissions(submissions: ReviewedSubmissionDTO[]): string {
		submissions.forEach(sub => {
			if (!!sub.edit) {
				sub.pop.submissions.push(sub.edit);
			}

			switch (sub.status) {
				// This shit shouldn't be here
				case ReviewStatus.NotReviewed:
					throw new VoxError('Un-reviewed submission received! Do not submit un-reviewed submissions!', 400)
				case ReviewStatus.Denied:
					this.rejectionsService.create(sub.pop)
					break;
				case ReviewStatus.Approved:
					const post: Post = new Post(sub.pop);
					this.postsService.create(post)
					break;
				case ReviewStatus.SuperApproved:	
					this.postsService.create(sub.pop)
					break;
				default:
					throw new VoxError('Submission with an invalid post-status received!', 400)
			}

		});
		return '';
	}
}
