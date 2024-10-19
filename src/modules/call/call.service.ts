import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';

@Injectable()
export class CallService {
  private calls = [];

  create(createCallDto: CreateCallDto) {
    const newCall = {
      id: this.calls.length + 1,
      ...createCallDto,
    };
    this.calls.push(newCall);
    return newCall;
  }

  findAll() {
    return this.calls;
  }

  findOne(id: number) {
    const call = this.calls.find(call => call.id === id);
    if (!call) {
      throw new NotFoundException(`Call with ID ${id} not found`);
    }
    return call;
  }

  update(id: number, updateCallDto: UpdateCallDto) {
    const callIndex = this.calls.findIndex(call => call.id === id);
    if (callIndex === -1) {
      throw new NotFoundException(`Call with ID ${id} not found`);
    }
    const updatedCall = {
      ...this.calls[callIndex],
      ...updateCallDto,
    };
    this.calls[callIndex] = updatedCall;
    return updatedCall;
  }

  remove(id: number) {
    const callIndex = this.calls.findIndex(call => call.id === id);
    if (callIndex === -1) {
      throw new NotFoundException(`Call with ID ${id} not found`);
    }
    const removedCall = this.calls.splice(callIndex, 1);
    return removedCall[0]; // Return the removed call
  }
}
