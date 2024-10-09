import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../../database/repositories/user.repository';
import { JwtStrategyPayload } from '../../shared/dto/jwt-strategy-payload.dto';
import { UserDocument } from '../../database/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtStrategyPayload): Promise<UserDocument> {
    if (!payload._id) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findById(payload._id);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
