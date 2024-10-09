import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';
import { RegisterDto } from '../../modules/auth/dto/register.dto';
import { DUPLICATED_EMAIL } from '../../shared/constants/strings.constants';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  public findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id);
  }

  public findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email });
  }

  public async create(data: RegisterDto): Promise<UserDocument> {
    const user = await this.findByEmail(data.email);
    if (user) {
      throw new BadRequestException(DUPLICATED_EMAIL);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.userModel.create({
      ...data,
      password: hashedPassword,
    });
  }
}
