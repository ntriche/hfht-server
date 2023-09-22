import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ReviewStatus, Quality } from './submission.enums';
import { VoxPopDTO } from 'src/vox-pop/dto/vox-pop.dto';
import { v4 as uuidv4 } from 'uuid';

export type SubmissionDocument = HydratedDocument<Submission>;
@Schema()
export class Submission {
	constructor(voxPopDTO: VoxPopDTO, userIP: string) {
		this.submissions = new Array<string>;
		this.submissions[0] = voxPopDTO.submission;
		this.userIP = userIP;
		this.timestampAtSubmission = new Date;
		this.UUID = uuidv4();
	}

	@Prop()
	userIP: string;

	@Prop()
	UUID: string;
 
	@Prop()
	timestampAtSubmission: Date;

	@Prop()
	postID: string;

	@Prop()
	timestampAtPost: Date;

	@Prop()
	submissions: Array<string>;

	@Prop({type: Number, enum: ReviewStatus})
	reviewStatus: ReviewStatus = ReviewStatus.Unreviewed;

	@Prop({type: Number, enum: Quality})
	quality: Quality = Quality.None;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);