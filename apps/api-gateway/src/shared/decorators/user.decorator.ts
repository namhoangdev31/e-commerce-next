import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from '../../database/schemas/user.schema';

/**
 * Use to get authenticated user as **UserEntity**
 */
export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext): UserDocument => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
