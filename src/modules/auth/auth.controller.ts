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
  @Post('refresh-token')
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
  @UseGuards(JwtAuthGuard)
  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot password' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Forgot password successfully' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email)
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Reset password successfully' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async resetPassword(@Body('token') token: string, @Body('newPassword') newPassword: string) {
    return this.authService.resetPassword(token, newPassword)
  }

  @Post('verify-email')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify email' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Verify email successfully' })
  async verifyEmail(@Body('token') token: string) {
    return this.authService.verifyEmail(token)
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Change password successfully' })
  async changePassword(
    @User() user: UsersDocument,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.changePassword(user, oldPassword, newPassword)
  }
}
