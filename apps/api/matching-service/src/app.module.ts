import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MatchingModule } from './matching/matching.module';

@Module({
  imports: [PrismaModule, MatchingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
