import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { VoxPop } from 'src/vox-pop/vox-pop.class';

export type PostDocument = Post & Document;
@Schema()
export class Post {
	constructor(voxPop: VoxPop) {
		if (!!voxPop.userIP) {
			this.userIP = voxPop.userIP;
		}

		if (!!voxPop.timestampAtSubmission) {
			this.timestampAtSubmission = voxPop.timestampAtSubmission;
		}

		if (!!voxPop.timestampAtPost) {
			this.timestampAtPost = voxPop.timestampAtPost;
		}

		if (!!voxPop.submissions) {
			this.submissions = voxPop.submissions;
		}

		if (!!voxPop.UUID) {
			this.UUID = voxPop.UUID;
		}

		if (!!voxPop.postID) {
			this.postID = voxPop.postID;
		}
	}

	@Prop()
	userIP: string;

	@Prop()
	timestampAtSubmission: Date;

	@Prop()
	timestampAtPost: Date;

	@Prop()
	submissions: string[];

	@Prop()
	UUID: string;

	@Prop()
	postID?: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
