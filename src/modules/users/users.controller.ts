import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { OtpDto } from '../auth/dto/otp.dto'
import { User } from '../../shared/decorators'
import { UsersDocument } from '../../database/schemas/users.schema'
import { ForgotPassDto, ResetPassDto } from './dto/forgot-pass.dto'
import { ResetPassInterface } from '../../interfaces/reset-pass.interface'
import { Public } from '../auth/decorators/public.decorator'
import { ChangePassDto } from './dto/change-pass.dto'

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('forgotPassword')
  @ApiOperation({ summary: 'Forgot password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Forgot password successfully!',
    schema: {
      example: {
        status_code: 200,
        message: 'Forgot password successfully!',
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Public()
  async forgotPassword(@Body() email: ForgotPassDto) {
    const result = await this.usersService.forgotPassword(email)
    return {
      status_code: HttpStatus.OK,
      message: 'Forgot password successfully!',
    }
  }

  @Public()
  @Post('resetPassword')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Reset password successfully' })
  @Public()
  async resetPassword(@Body() data: ResetPassDto): Promise<ResetPassInterface> {
    return this.usersService.resetPassword(data)
  }

  @Post('verifyEmail')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Verify email successfully!' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async verifyEmail(@Body() body: OtpDto, @User() user: UsersDocument) {
    return this.usersService.verifyEmail(body, user)
  }

  @Post('changePassword')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Change password successfully' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async changePassword(@User() user: UsersDocument, @Body() data: ChangePassDto) {
    await this.usersService.changePassword(user, data)
    return { status: HttpStatus.OK, message: 'Change password successfully' }
  }

  @Get('getProfile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Public()
  async getProfile() {
    return await this.usersService.getDetailUser()
  }

  @Post('sendRequestOtp')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async sendRequestOtp(@User() user: UsersDocument) {
    return this.usersService.sendRequestOtp(user)
  }

  @Post(':userCode/role/:roleCode')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign role to user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User role updated successfully' })
  @ApiParam({
    name: 'userCode',
    description: 'Code of the user to assign role to',
    example: '67287228e9647d06a5097ff6',
  })
  @ApiParam({
    name: 'roleCode',
    description: 'Code of the role to assign to user',
    example: '6728881a420a057677044177',
  })
  async assignRoleToUser(
    @Param('userCode') userCode: string,
    @Param('roleCode') roleCode: string,
    @User() user: UsersDocument,
  ) {
    return this.usersService.assignRolesToUser(userCode, roleCode, user)
  }
}
