import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { VoxPop } from 'src/vox-pop/vox-pop.class';

export enum ReviewStatus {
	NotReviewed = 0,
	Denied,
	Approved,
	SuperApproved,
}

export type SubmissionDocument = Submission & Document;
@Schema()
export class Submission {
	constructor(voxPop: VoxPop, reviewStatus: ReviewStatus = ReviewStatus.NotReviewed, timestampAtPost: Date = null, postID: string = '') {
		if (!!voxPop.userIP) { this.userIP = voxPop.userIP; }
		if (!!voxPop.timestamp) { this.timestampAtSubmission = voxPop.timestamp; }
		if (!!voxPop.submissions) { this.submissions = voxPop.submissions; }
		if (!!voxPop.UUID) { this.UUID = voxPop.UUID; }
		this.reviewStatus = reviewStatus;
		if (!!timestampAtPost) { this.timestampAtPost = timestampAtPost; }
		if (!!postID) { this.postID = postID; }
	}

	@Prop()
	userIP: string = '';

	@Prop()
	timestampAtSubmission: Date;

	@Prop()
	submissions: string[];

	@Prop()
	UUID: string;

	@Prop()
	reviewStatus: ReviewStatus;

	@Prop({require: false})
	timestampAtPost: Date;

	@Prop({require: false})
	postID: string;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
