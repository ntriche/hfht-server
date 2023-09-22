import { PartialType } from "@nestjs/mapped-types";
import { SubmissionDTO } from "./submission.dto";
import { IsUUID, IsEnum } from "class-validator";
import { ReviewStatus } from "../submission.enums";

export class ReviewDTO extends PartialType(SubmissionDTO) {
    @IsUUID(4)
	UUID: string;

    @IsEnum(ReviewStatus)
	reviewStatus: ReviewStatus;
}