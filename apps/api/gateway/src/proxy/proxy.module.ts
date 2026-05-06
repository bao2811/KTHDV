import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HttpProxyService } from './implementations/http-proxy.service';
import { CandidateProxyController } from './controllers/candidate-proxy.controller';
import { JobProxyController } from './controllers/job-proxy.controller';
import { SERVICE_PROXY } from './proxy.constants';

/**
 * Service Proxy Module
 *
 * Provides abstracted interface for communicating with microservices.
 * Can be swapped between HTTP, RabbitMQ, gRPC without changing business logic.
 *
 * Migration path to RabbitMQ:
 * 1. Create `implementations/rabbitmq-proxy.service.ts` implementing IServiceProxy
 * 2. Update controllers to inject RabbitMqProxyService
 * 3. Or keep using the interface and swap the provider here
 */
@Module({
  imports: [HttpModule],
  controllers: [CandidateProxyController, JobProxyController],
  providers: [
    {
      provide: SERVICE_PROXY,
      useClass: HttpProxyService,
    },
  ],
  exports: [SERVICE_PROXY],
})
export class ProxyModule {}
