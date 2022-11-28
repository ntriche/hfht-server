import { Injectable } from '@nestjs/common';
import { Post, PostDocument } from './post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class PostsService {
	constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

	async find(query: FilterQuery<Post>): Promise<Post[]> {
		return this.postModel.find(query);
	}

	async findOne(query: FilterQuery<Post>): Promise<Post> {
		return this.postModel.findOne(query);
	}

	async findOneAndUpdate(query: FilterQuery<Post>, post: Partial<Post>): Promise<Post> {
		return this.postModel.findOneAndUpdate(query, post);
	}

	async create(post: Post): Promise<Post> {
		const newPost = new this.postModel(post);
		return newPost.save();
	}
}
