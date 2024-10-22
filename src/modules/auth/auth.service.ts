import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { UserRepository } from '../../database/repositories/user.repository'
import { INCORRECT_CREDENTIAL } from '../../shared/constants/strings.constants'
import { LoginResponse } from 'src/interfaces/login'
import { RefreshTokenDto } from './dto/refreshToken.dto'
import process from 'process'

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: LoginDto): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(data.email)
    if (!user) {
      throw new BadRequestException(INCORRECT_CREDENTIAL)
    }

    const passwordMatched = await bcrypt.compare(data.password, user.passwordHash)
    if (!passwordMatched) {
      throw new BadRequestException(INCORRECT_CREDENTIAL)
    }
    const accessToken = this.jwtService.sign(
      {
        userId: user._id,
        user,
      },
      {
        expiresIn: '30d',
        secret: process.env.JWT_SECRET,
      },
    )
    const refreshToken = this.jwtService.sign(
      { userId: user._id },
      { expiresIn: '90d', secret: process.env.JWT_SECRET },
    )
    const dataSave = await this.userRepository.saveRefresh(refreshToken, user._id)
    if (user || dataSave) {
      return {
        id: user._id,
        accessToken: accessToken,
        refreshToken: dataSave.refreshToken,
      }
    }
  }

  async register(data: RegisterDto) {
    const user = await this.userRepository.create(data)

    return this.jwtService.sign({
      _id: user._id,
      user: user,
    })
  }

  async reGenAccessToken(data: RefreshTokenDto): Promise<LoginResponse> {
    const user = await this.userRepository.refreshToken(data)
    const accessToken = this.jwtService.sign(
      {
        userId: user._id,
        user,
      },
      {
        expiresIn: '30d',
        secret: process.env.JWT_SECRET,
      },
    )
    const refreshToken = this.jwtService.sign(
      { userId: user._id },
      { expiresIn: '90d', secret: process.env.JWT_SECRET },
    )
    const saveData = await this.userRepository.saveRefresh(data.refreshToken, data.userId)
    if (user || saveData) {
      return {
        id: user._id,
        accessToken: accessToken,
        refreshToken: saveData.refreshToken,
      }
    } else {
      throw new BadRequestException()
    }
  }
}
