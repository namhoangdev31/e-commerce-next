import { Module } from '@nestjs/common'
import { CdnService } from './cdn-service.service'
import { FirebaseModule } from 'nestjs-firebase'
import { CdnServiceController } from './cdn-service.controller';

@Module({
  imports: [FirebaseModule],
  providers: [CdnService],
  controllers: [CdnServiceController],
})
export class CdnServiceModule {}
