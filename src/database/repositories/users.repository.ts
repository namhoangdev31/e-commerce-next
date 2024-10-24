import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: Partial<User>): Promise<User> {
    const createdUser = new this.userModel(data);
    return createdUser.save();
  }

  async findUnique(filter: Partial<User>): Promise<User | null> {
    return this.userModel.findOne(filter).exec();
  }

  async findMany(params: {
    skip?: number;
    limit?: number;
    filter?: Partial<User>;
    sort?: Record<string, 1 | -1>;
  }): Promise<User[]> {
    const { skip, limit, filter, sort } = params;
    return this.userModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .exec();
  }

  async update(filter: Partial<User>, data: Partial<User>): Promise<User | null> {
    return this.userModel.findOneAndUpdate(filter, data, { new: true }).exec();
  }

  async delete(filter: Partial<User>): Promise<User | null> {
    return this.userModel.findOneAndDelete(filter).exec();
  }
}
