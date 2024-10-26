import { Test, TestingModule } from '@nestjs/testing';
import { SyncDataScheduleService } from './sync-data-schedule.service';

describe('SyncDataScheduleService', () => {
  let service: SyncDataScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SyncDataScheduleService],
    }).compile();

    service = module.get<SyncDataScheduleService>(SyncDataScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
