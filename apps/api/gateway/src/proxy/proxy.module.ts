import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HttpProxyService } from './implementations/http-proxy.service';
import { CandidateProxyController } from './controllers/candidate-proxy.controller';
import { JobProxyController } from './controllers/job-proxy.controller';
import { InterviewProxyController } from './controllers/interview-proxy.controller';
import { MatchingProxyController } from './controllers/matching-proxy.controller';
import { NotificationProxyController } from './controllers/notification-proxy.controller';
import { FileUploadProxyController } from './controllers/file-upload-proxy.controller';
import { SERVICE_PROXY } from './proxy.constants';

console.log('Loading ProxyModule with 5 proxy controllers...');

/**
 * Service Proxy Module
 *
 * Provides abstracted interface for communicating with microservices.
 * Can be swapped between HTTP, RabbitMQ, gRPC without changing business logic.
 */
@Module({
  imports: [HttpModule],
  controllers: [
    CandidateProxyController,
    JobProxyController,
    InterviewProxyController,
    MatchingProxyController,
    NotificationProxyController,
    FileUploadProxyController,
  ],
  providers: [
    {
      provide: SERVICE_PROXY,
      useClass: HttpProxyService,
    },
  ],
  exports: [SERVICE_PROXY],
})
export class ProxyModule {}
