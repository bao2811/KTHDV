import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { InterviewModule } from './interview/interview.module';

@Module({
  imports: [PrismaModule, InterviewModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
