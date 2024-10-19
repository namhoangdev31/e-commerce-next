import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { StreamService } from './stream.service';
import { CreateStreamDto } from './dto/create-stream.dto';
import { UpdateStreamDto } from './dto/update-stream.dto';

@WebSocketGateway()
export class StreamGateway {
  constructor(private readonly streamService: StreamService) {}

  @SubscribeMessage('createStream')
  create(@MessageBody() createStreamDto: CreateStreamDto) {
    return this.streamService.create(createStreamDto);
  }

  @SubscribeMessage('findAllStream')
  findAll() {
    return this.streamService.findAll();
  }

  @SubscribeMessage('findOneStream')
  findOne(@MessageBody() id: number) {
    return this.streamService.findOne(id);
  }

  @SubscribeMessage('updateStream')
  update(@MessageBody() updateStreamDto: UpdateStreamDto) {
    return this.streamService.update(updateStreamDto.id, updateStreamDto);
  }

  @SubscribeMessage('removeStream')
  remove(@MessageBody() id: number) {
    return this.streamService.remove(id);
  }
}
