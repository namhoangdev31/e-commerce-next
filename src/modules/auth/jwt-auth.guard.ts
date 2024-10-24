import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import process from 'process'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from './decorators/public.decorator'
import { AuthRepository } from '../../database/repositories/auth.repository'
import { Types } from 'mongoose'
import { Request } from 'express'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private readonly userRepository: AuthRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new UnauthorizedException()
    }
    try {
      const data = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      })
      const userId = new Types.ObjectId(data.userId)
      const sessionId = new Types.ObjectId(data.sessionId)
      const session = await this.userRepository.findValidSession(sessionId, userId)

      if (!session) {
        // await this.userRepository.deleteManySessions({ userId })
        throw new UnauthorizedException('Session expired')
      } else {
        await this.userRepository.updateSession(
          { _id: session._id },
          { isOnline: true, lastActiveAt: new Date() },
        )
      }
      if (!data.user.isValidateEmail) {
        throw new HttpException('Please validate your email!', HttpStatus.FORBIDDEN)
      }
      request['user'] = data.user
      return true
    } catch (e) {
      if (e instanceof HttpException) {
        throw e
      }
      throw new UnauthorizedException()
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? []
    const tokenSignature = request.cookies?.['tokenSignature']
    if (type === 'Bearer' && token) {
      if (tokenSignature) {
        return `${token}.${tokenSignature}`
      }
      return token
    }

    return undefined
  }
}
