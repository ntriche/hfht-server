import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { VoxPop } from 'src/vox-pop/vox-pop.class';

export type SubmissionDocument = Submission & Document;
@Schema()
export class Submission {
	constructor(voxPop: VoxPop,) {
		if (!!voxPop.userIP) { this.userIP = voxPop.userIP; }
		if (!!voxPop.timestamp) { this.timestamp = voxPop.timestamp; }
		if (!!voxPop.submissions) { this.submissions = voxPop.submissions; }
		if (!!voxPop.UUID) { this.UUID = voxPop.UUID; }
	}

	@Prop()
	userIP: string;

	@Prop()
	timestamp: Date;

	@Prop()
	submissions: string[];

	@Prop()
	UUID: string;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
