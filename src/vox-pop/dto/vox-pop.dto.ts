import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class VoxPopDTO {
	@IsNotEmpty()
	@MinLength(2)
	@MaxLength(1024)
	public submission: string;
}