import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HfhtLoggerService } from './logger/hfht.logger.service';

declare const module: any;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useLogger(new HfhtLoggerService())

	const configService = app.get(ConfigService);
	const log = await app.resolve(HfhtLoggerService);
	log.debug(`application startup environment: ${configService.get<string>("NODE_ENV")}`)

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
