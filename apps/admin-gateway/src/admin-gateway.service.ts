import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminGatewayService {
  getHello(): string {
    return 'Hello World!';
  }
}
