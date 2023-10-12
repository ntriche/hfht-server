import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HfhtLoggerService } from './logger/hfht.logger.service';

declare const module: any;

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bufferLogs: true,
	});
	app.useLogger(app.get(HfhtLoggerService))
	const log = app.get(HfhtLoggerService);

	const configService = app.get(ConfigService);
	log.debug(`starting in ${configService.get<string>("NODE_ENV")}`)

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true
		})
	);

	app.enableCors();

	await app.listen(3000);

	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
}
bootstrap();
