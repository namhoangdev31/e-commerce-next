import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UsersDocument } from '../../database/schemas/users.schema'

/**
 * Use to get authenticated user as **UserEntity**
 */
export const User = createParamDecorator((data: string, ctx: ExecutionContext): UsersDocument => {
  const request = ctx.switchToHttp().getRequest()
  return request.user
})
