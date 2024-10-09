import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserRepository } from './repositories/user.repository';
import { HeaderRepository } from './repositories/header.repository';
import { Header, HeaderSchema } from './schemas/header.schema';
import { NavItem, NavItemSchema } from './schemas/navItem.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Header.name, schema: HeaderSchema },
      { name: NavItem.name, schema: NavItemSchema },
    ]),
  ],
  providers: [UserRepository, HeaderRepository],
  exports: [UserRepository, HeaderRepository],
})
export class DatabaseModule {}
