import { Module } from '@nestjs/common';
import { NonUserService } from './non-user.service';
import { NonUserController } from './non-user.controller';

@Module({
  controllers: [NonUserController],
  providers: [NonUserService],
})
export class NonUserModule {}
