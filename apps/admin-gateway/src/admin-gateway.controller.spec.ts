import { Test, TestingModule } from '@nestjs/testing';
import { AdminGatewayController } from './admin-gateway.controller';
import { AdminGatewayService } from './admin-gateway.service';

describe('AdminGatewayController', () => {
  let adminGatewayController: AdminGatewayController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AdminGatewayController],
      providers: [AdminGatewayService],
    }).compile();

    adminGatewayController = app.get<AdminGatewayController>(AdminGatewayController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(adminGatewayController.getHello()).toBe('Hello World!');
    });
  });
});
