import { Test, TestingModule } from '@nestjs/testing';
import { MainGatewayController } from './main-gateway.controller';
import { MainGatewayService } from './main-gateway.service';

describe('MainGatewayController', () => {
  let mainGatewayController: MainGatewayController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MainGatewayController],
      providers: [MainGatewayService],
    }).compile();

    mainGatewayController = app.get<MainGatewayController>(MainGatewayController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(mainGatewayController.getHello()).toBe('Hello World!');
    });
  });
});
