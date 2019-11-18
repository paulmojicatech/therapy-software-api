import { Controller, Get } from "@nestjs/common";

@Controller('heartbeat')

export class HeartbeatController {
    @Get()
    async getHeartbeat(): Promise<boolean> {
        console.log('HIT');
        return Promise.resolve(true);
    }
}

