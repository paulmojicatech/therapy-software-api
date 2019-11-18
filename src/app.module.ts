import { Module } from '@nestjs/common';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { ClientsController } from 'src/clients/clients.controller';
import { DataService } from 'src/services/data.service';
import { HeartbeatController } from 'src/heartbeat/heatbeat.controller';


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
export class AppModule {}
