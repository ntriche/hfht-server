import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema()
export class Post {
    @Prop()
    userIP: string;

    @Prop()
    timestamp: Date;

    @Prop()
    submission: string;

    @Prop()
    postID: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);