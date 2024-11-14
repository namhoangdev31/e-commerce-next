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
  Put,
  VERSION_NEUTRAL,
  Version,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { JwtAuthGuard } from './jwt-auth.guard'
import { User } from '../../shared/decorators'
import { Public } from './decorators/public.decorator'
import { RefreshTokenDto } from './dto/refreshToken.dto'
import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiTags,
  ApiExcludeEndpoint,
  ApiParam,
} from '@nestjs/swagger'
import { UsersDocument } from '../../database/schemas/users.schema'
import { PROD_ENV } from '../../shared/constants/strings.constants'
import { ForgotPassDto, ResetPassDto } from '../users/dto/forgot-pass.dto'

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful' })
  async loginV1(@Body() dto: LoginDto, @Req() req: Request) {
    return this.authService.login(dto, req)
  }

  @Post('login')
  @Public()
  @Version('2')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful' })
  async loginV2(@Body() dto: LoginDto, @Req() req: Request) {
    return this.authService.login(dto, req)
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout current user session' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Logout successful' })
  async logout(@User() user: UsersDocument, @Req() req: Request) {
    return this.authService.logout(user, req)
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Token refreshed successfully' })
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto)
  }

  @Put('password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Password changed successfully' })
  async changePassword(@User() user: UsersDocument, @Body() dto: any) {
    return this.authService.changePassword(user, dto)
  }

  @Post('password/reset')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Reset email sent successfully' })
  async requestPasswordReset(@Body() dto: any) {
    return this.authService.requestPasswordReset(dto)
  }

  @Put('password/reset/:token')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Password reset successful' })
  @ApiParam({ name: 'token', description: 'Password reset token' })
  async resetPassword(@Param('token') token: string, @Body() dto: ForgotPassDto) {
    return this.authService.resetPassword(token, dto)
  }

  @Get('verifyEmail/:token')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email with token' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Email verified successfully' })
  @ApiParam({ name: 'token', description: 'Email verification token' })
  async verifyEmail(@Param('token') token: string) {
    return this.authService.verifyEmail(token)
  }

  @Post('verifyEmail/resend')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend email verification' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Verification email resent' })
  async resendVerificationEmail(@User() user: UsersDocument) {
    return this.authService.resendVerificationEmail(user)
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
