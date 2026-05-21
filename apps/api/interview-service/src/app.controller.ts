import { Controller, Get, Header } from '@nestjs/common';
import { collectDefaultMetrics, register } from 'prom-client';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';

register.setDefaultLabels({ service: 'interview-service' });
collectDefaultMetrics({ register });

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('health')
  getHealth() {
    return this.appService.getHealth('interview-service');
  }

  @Public()
  @Get('ready')
  getReadiness() {
    return this.appService.getReadiness('interview-service');
  }

  @Public()
  @Get('metrics')
  @Header('Content-Type', register.contentType)
  getMetrics() {
    return register.metrics();
  }
}
