
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus, Logger, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HfhtLoggerService } from 'src/logger/hfht.logger.service';

@Injectable()
export class SubmissionsInterceptor implements NestInterceptor {
	constructor(private logger: HfhtLoggerService) {
		this.logger.setContext(SubmissionsInterceptor.name)
	}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next
			.handle()
			.pipe(
				tap({
					next: (val: any) => {
						if (!val) {
							this.logger.warn("Resource not found");
							throw new HttpException(`Resource not found`, HttpStatus.NOT_FOUND);
						}
					},
					error: (error) => {
						this.logger.error(error);
					}
				})
			);
	}
}
