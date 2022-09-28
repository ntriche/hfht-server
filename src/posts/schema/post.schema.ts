import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { voxPop } from '../../vox-pop/interface/vox-pop.interface'

export type PostDocument = Post & Document;
@Schema()
export class Post {
    constructor(voxPop: voxPop) {
        if (!!voxPop.userIP) {
            this.userIP = voxPop.userIP;
        }

        if (!!voxPop.timestamp) {
            this.timestamp = voxPop.timestamp;
        }

        if (!!voxPop.submission) {
            this.submission = voxPop.submission;
        }

        if (!!voxPop.UUID) {
            this.UUID = voxPop.UUID;
        }

        if (!!voxPop.alteredSubmission) {
            this.alteredSubmission = voxPop.alteredSubmission;
        }

        if (!!voxPop.postID) {
            this.postID = voxPop.postID;
        }
    }

    @Prop()
    userIP: string;

    @Prop()
    timestamp: Date;

    @Prop()
    submission: string;

    @Prop()
    UUID: string;

    @Prop()
    alteredSubmission?: string

    @Prop()
    postID?: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);