import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        // logger: ['error', 'warn', 'debug'],
    });
    // 啟用全域的ValidationPipe
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(7321);

    console.log(`Application is running on: http://localhost:7321`);
}
bootstrap();
