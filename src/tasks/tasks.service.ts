import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HfhtLoggerService } from 'src/logger/hfht.logger.service';
import { TumblrService } from 'src/tumblr/tumblr.service';

@Injectable()
export class TasksService {
    constructor(
		private logger: HfhtLoggerService,
        private readonly tumblrService: TumblrService,
    ) {
        this.logger.setContext(TasksService.name)
    }

    @Cron(CronExpression.EVERY_HOUR)
    fetchTumblrInbox() {
        // this.tumblrService. do the thing
    }
}
