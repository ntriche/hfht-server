import { v4 as uuidv4 } from 'uuid';

export class VoxPopDTO {
	public userIP: string;
	public submission: string;
}

export class VoxPop {
	public userIP: string;
	public submissions: string[];
	public UUID: string;
	public postID?: string;
	public timestampAtSubmission: Date;
	public timestampAtPost?: Date;

	constructor(voxPopDTO: VoxPopDTO) {
		this.userIP = voxPopDTO.userIP;
		this.submissions = new Array<string>;
		this.submissions[0] = voxPopDTO.submission;

		this.UUID = uuidv4(); 
		this.timestampAtSubmission = new Date();
	}

	// Submissions are an array where the last entry in the array is the most recently modified submission - previous subs were modified for one reason or another, so the most recent should be used
	public getMostRecentSubmission(): string {
		return this.submissions[this.submissions.length - 1];
	}

	public removeHTMLTags(): string {
		const sub = this.getMostRecentSubmission();
		const reg = new RegExp(/<.+?>/gm);

		if (sub.search(reg) === -1) {
			return sub;
		}

		return sub.replaceAll(reg, '');
		// this.log.write('Submission contains HTML tags. New submission is as follows: ' + sub);
	}
}