import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { VoxPop } from 'src/vox-pop/vox-pop.class';

export type PostDocument = Post & Document;
@Schema()
export class Post {
	constructor(voxPop: VoxPop, postID: string = '', timestampAtPost: Date = null) {
		if (!!voxPop.userIP) { this.userIP = voxPop.userIP; }
		if (!!voxPop.submissions) { this.submissions = voxPop.submissions; }
		if (!!voxPop.UUID) { this.UUID = voxPop.UUID; }
		if (!!voxPop.timestamp) {this.timestampAtSubmission = voxPop.timestamp; }
		this.timestampAtPost = timestampAtPost;
		this.postID = postID;
	}

	@Prop()
	userIP: string;

	@Prop()
	timestampAtSubmission: Date;

	@Prop({require: false})
	timestampAtPost: Date;

	@Prop()
	submissions: string[];

	@Prop()
	UUID: string;

	@Prop({require: false})
	postID: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
