import { Injectable } from '@nestjs/common';
import { VoxPopService } from 'src/vox-pop/vox-pop.service';

@Injectable()
export class DashboardService {
	constructor(private voxPopService: VoxPopService) {}

	getPosts(): string {
		const voxPops = this.voxPopService.getEnqueuedPosts();
		console.log(voxPops);
		if (voxPops.length > 0) {
			return JSON.stringify(voxPops);
		}
		return 'There are no enqueued posts.';
	}
}
