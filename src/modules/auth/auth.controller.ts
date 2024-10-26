import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { JwtAuthGuard } from './jwt-auth.guard'
import { UserDocument } from '../../database/schemas/user.schema'
import { User } from '../../shared/decorators'
import { Public } from './decorators/public.decorator'
import { RefreshTokenDto } from './dto/refreshToken.dto'
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger'
import { UsersDocument } from '../../database/schemas/users.schema'
import { OtpDto } from './dto/otp.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    return this.authService.login(dto, req)
  }

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async registerCustomer(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async getProfile(@User() user: UsersDocument, @Req() req: Request) {
    const userReturn = user
    return {
      userReturn,
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('refreshToken')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.reGenAccessToken(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async logout(@User() user: UsersDocument, @Req() req: Request) {
    return this.authService.logout(user, req)
  }
}
