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
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { OtpDto } from '../auth/dto/otp.dto'
import { User } from '../../shared/decorators'
import { UsersDocument } from '../../database/schemas/users.schema'
import { ForgotPassDto, ResetPassDto } from './dto/forgot-pass.dto'
import { ResetPassInterface } from '../../interfaces/reset-pass.interface'
import { Public } from '../auth/decorators/public.decorator'

@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Get()
  findAll() {
    return this.usersService.findAll()
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id)
  }

  @Post('forgot-password')
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
  async forgotPassword(@Body() email: ForgotPassDto, @User() user: UsersDocument) {
    const result = await this.usersService.forgotPassword(email, user)
    return {
      status_code: HttpStatus.OK,
      message: 'Forgot password successfully!',
    }
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Reset password successfully' })
  async resetPassword(@Body() data: ResetPassDto): Promise<ResetPassInterface> {
    return this.usersService.resetPassword(data)
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Verify email successfully!' })
  async verifyEmail(@Body() body: OtpDto, @User() user: UsersDocument) {
    return this.usersService.verifyEmail(body, user)
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Change password successfully' })
  async changePassword(
    @User() user: UsersDocument,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.usersService.changePassword(user, oldPassword, newPassword)
  }
}
