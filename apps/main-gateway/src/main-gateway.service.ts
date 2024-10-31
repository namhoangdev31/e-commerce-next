import { Injectable } from '@nestjs/common';

@Injectable()
export class MainGatewayService {
  getHello(): string {
    return 'Hello World!';
  }
}
