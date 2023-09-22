import { MaxLength, MinLength } from "class-validator";

export class VoxPopDTO {
	@MinLength(2)
	@MaxLength(1024)
	public submission: string;
}