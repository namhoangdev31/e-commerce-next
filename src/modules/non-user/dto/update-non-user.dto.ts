import { PartialType } from '@nestjs/mapped-types';
import { CreateNonUserDto } from './create-non-user.dto';

export class UpdateNonUserDto extends PartialType(CreateNonUserDto) {}
