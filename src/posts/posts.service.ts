import { Injectable } from '@nestjs/common';
import { voxPop } from 'src/vox-pop/interface/vox-pop.interface';
import { PostsRepository } from './posts.repository';
import { Post } from './schema/post.schema';

@Injectable()
export class PostsService {
    constructor(private readonly postsRepository: PostsRepository) {}

    async storePost(voxPop: voxPop): Promise<Post> {
        return this.postsRepository.create({
            userIP: voxPop.userIP,
            timestamp: voxPop.timestamp,
            submission: voxPop.submission,
            postID: voxPop?.postID,
        })
    }

    async getPosts(): Promise<Post[]> {
        return this.postsRepository.find({});
    }
}
