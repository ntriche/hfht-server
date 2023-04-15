import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
	private logs: string[] = [];

	createMessageBase(): string {
		return '[hfht] ' + this.getTimeStamp() + ' ';
	}

	getTimeStamp(): string {
		const dt = new Date();
		const stamp: string = dt.getMonth().toString() + '/' + dt.getDay().toString() + '/' + dt.getFullYear().toString() + ' - ' + dt.getHours().toString() + ':' + dt.getMinutes().toString();
		return stamp;
	}

	write(msg: string) {
		msg = this.createMessageBase() + '[INF] ' + msg;
		this.logs.push(msg);
		console.log(msg);
	}

	succ(msg: string) {
		msg = this.createMessageBase() + '[SUC] ' + msg;
		this.logs.push(msg);
		console.log(msg);
	}

	error(msg: string) {
		msg = this.createMessageBase() + '[ERR] ' + msg;
		this.logs.push(msg);
		console.log(msg);
	}

	public text_colors: Record<string, string> = {
		black: 		'\x1b[30m',
		red: 		'\x1b[31m',
		green: 		'\x1b[32m',
		yellow: 	'\x1b[33m',
		blue: 		'\x1b[34m',
		magenta: 	'\x1b[35m',
		cyan: 		'\x1b[36m',
		white: 		'\x1b[37m',
		crimson: 	'\x1b[38m',
	};

	public bg_colors: Record<string, string> = {
		black: 		'\x1b[40m',
		red: 		'\x1b[41m',
		green: 		'\x1b[42m',
		yellow: 	'\x1b[43m',
		blue: 		'\x1b[44m',
		magenta: 	'\x1b[45m',
		cyan: 		'\x1b[46m',
		white: 		'\x1b[47m',
		crimson: 	'\x1b[48m',
	};

	public modifiers: Record<string, string> = {
		reset: 		'\x1b[0m',
		bright: 	'\x1b[1m',
		dim: 		'\x1b[2m',
		underscore: '\x1b[4m',
		blink: 		'\x1b[5m',
		reverse: 	'\x1b[7m',
		hidden: 	'\x1b[8m',
	};
}
