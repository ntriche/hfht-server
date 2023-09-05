import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerService } from 'src/logger/logger.service';
import { TumblrService } from 'src/tumblr/tumblr.service';

@Injectable()
export class TasksService {
    constructor(
		private readonly log: LoggerService,
        private readonly tumblrService: TumblrService,
    ) {}

    @Cron(CronExpression.EVERY_HOUR)
    fetchTumblrInbox() {
        // this.tumblrService. do the thing
    }
}
