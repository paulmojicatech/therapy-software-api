import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsController } from './clients/clients.controller';
import { DataService } from './services/data.service';
import { HeartbeatController } from './heartbeat/heatbeat.controller';
import { EmailController } from './email/email.controller';
import { EmailService } from './services/email.service';


@Module({
  imports: [],
  controllers: [
    AppController, 
    ClientsController, 
    HeartbeatController, 
    EmailController
  ],
  providers: [
    AppService,
    DataService,
    EmailService
  ],
})
export class AppModule { }
