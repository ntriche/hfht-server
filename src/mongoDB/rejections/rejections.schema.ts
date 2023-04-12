import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Submission } from '../submissions/submissions.schema';

export type RejectionDocument = Rejection & Document;
@Schema()
export class Rejection extends Submission {
}

export const RejectionSchema = SchemaFactory.createForClass(Rejection);
