import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import { VoxPopService } from 'src/vox-pop/vox-pop.service';

@Injectable()
export class DashboardService {
	constructor(private voxPopService: VoxPopService, private log: LoggerService) {}

	getPosts(): string {
		const voxPops = this.voxPopService.getEnqueuedPosts();
		let msg = `Request received for enqueued posts - `
		if (voxPops.length > 0) {
			this.log.write(msg + `returning ${voxPops.length} enqueued posts`);
			return JSON.stringify(voxPops);
		}
		this.log.write(msg + `but no posts are enqueued`);
		return 'There are no enqueued posts.';
	}
}
