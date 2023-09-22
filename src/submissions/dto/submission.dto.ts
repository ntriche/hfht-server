import { IsArray, IsDateString, IsEnum, IsIP, IsOptional, IsString, IsUUID } from "class-validator";
import { ReviewStatus, Quality } from "../submission.enums";

export class SubmissionDTO {
	@IsIP(4)
	userIP: string;

	@IsUUID(4)
	UUID: string;

	@IsDateString()
	timestampAtSubmission: Date;

	@IsOptional()
	@IsString()
	postID: string;
	
	@IsOptional()
	@IsDateString()
	timestampAtPost: Date;

	@IsArray()
	submissions: string[];

	@IsEnum(ReviewStatus)
	reviewStatus: ReviewStatus;

	@IsEnum(Quality)
	quality: Quality;
}