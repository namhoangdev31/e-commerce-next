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
import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiTags,
  ApiExcludeEndpoint,
} from '@nestjs/swagger'
import { UsersDocument } from '../../database/schemas/users.schema'
import { OtpDto } from './dto/otp.dto'
import { PROD_ENV } from '../../shared/constants/strings.constants'

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password if user is not active, send otp to email' })
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
    return this.authService.refreshToken(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async logout(@User() user: UsersDocument, @Req() req: Request) {
    return this.authService.logout(user, req)
  }

  @Post('sendRequestOtp')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async sendRequestOtp(@User() user: UsersDocument) {
    return this.authService.sendRequestOtp(user)
  }
}

const isProduction = process.env.NODE_ENV === PROD_ENV

if (isProduction) {
  ApiExcludeEndpoint()(
    AuthController.prototype,
    'login',
    Object.getOwnPropertyDescriptor(AuthController.prototype, 'login'),
  )
}
