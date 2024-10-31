import { Test, TestingModule } from '@nestjs/testing';
import { StreamGateway } from './stream.gateway';
import { StreamService } from './stream.service';

describe('StreamGateway', () => {
  let gateway: StreamGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StreamGateway, StreamService],
    }).compile();

    gateway = module.get<StreamGateway>(StreamGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
