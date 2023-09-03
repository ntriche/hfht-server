import { ReviewStatus, Quality } from "./submission.enums";

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