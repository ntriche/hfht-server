import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { VoxPop } from 'src/vox-pop/vox-pop.class';

export class SubmissionDTO {
	userIP: string;
	timestampAtSubmission: Date;
	submissions: string[];
	UUID: string;
	reviewStatus: ReviewStatus;
	timestampAtPost: Date;
	postID: string;
	quality: Quality;
}

export enum ReviewStatus {
	NotReviewed = 0,
	Denied,
	Approved,
	SuperApproved,
}

export enum Quality {
	None = 0,
	Poor,
	Common,
	Uncommon,
	Rare,
	Epic,
	Legendary,
}

export type SubmissionDocument = HydratedDocument<Submission>;
@Schema()
export class Submission {
	constructor(voxPop: VoxPop, reviewStatus: ReviewStatus = ReviewStatus.NotReviewed, timestampAtPost: Date = null, postID = '') {
		if (voxPop.userIP) { this.userIP = voxPop.userIP; }
		if (voxPop.timestamp) { this.timestampAtSubmission = voxPop.timestamp; }
		if (voxPop.submissions) { this.submissions = voxPop.submissions; }
		if (voxPop.UUID) { this.UUID = voxPop.UUID; }
		
		this.reviewStatus = reviewStatus;
		if (timestampAtPost) { this.timestampAtPost = timestampAtPost; }
		if (postID) { this.postID = postID; }

		this.quality = Quality.None;
	}

	@Prop()
	userIP = '';
 
	@Prop()
	timestampAtSubmission: Date;

	@Prop()
	submissions: string[];

	@Prop()
	UUID: string;

	@Prop()
	reviewStatus: ReviewStatus;

	@Prop()
	timestampAtPost: Date;

	@Prop()
	postID: string;

	@Prop()
	quality: Quality;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);