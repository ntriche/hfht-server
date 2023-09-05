import { IsArray, IsDate, IsEnum, IsIP, IsUUID } from "class-validator";
import { ReviewStatus, Quality } from "../submission.enums";

export class SubmissionDTO {
	@IsIP(4)
	userIP: string;

	@IsUUID(4)
	UUID: string;

	@IsDate()
	timestampAtSubmission: Date;

	// Optional
	postID: string;

	@IsDate()
	timestampAtPost: Date;

	@IsArray()
	submissions: string[];

	@IsEnum(ReviewStatus)
	reviewStatus: ReviewStatus;

	@IsEnum(Quality)
	quality: Quality;
}