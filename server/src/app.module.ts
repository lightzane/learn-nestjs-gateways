import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MyGateway } from './my.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, MyGateway],
})
export class AppModule {}
