import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsController } from './clients/clients.controller';
import { DataService } from './services/data.service';
import { HeartbeatController } from './heartbeat/heatbeat.controller';


@Module({
  imports: [],
  controllers: [
    AppController, 
    ClientsController, 
    HeartbeatController
  ],
  providers: [
    AppService,
    DataService
  ],
})
export class AppModule { }
