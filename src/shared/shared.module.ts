import { Module } from '@nestjs/common'
import { PrismaService } from './prisma-service/prisma-service.service'

@Module({
  imports: [],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class SharedModule {}
