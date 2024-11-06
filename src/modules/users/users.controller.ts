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
  Put,
  Query,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { SearchUserDto } from './dto/search-user.dto'
import { FilterUserDto } from './dto/filter-user.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
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
import { GetListDto } from './dto/get-list.dto'
import { UserRoleDto } from './dto/user-role.dto'

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

  @Post('sendRequestOtp')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async sendRequestOtp(@User() user: UsersDocument) {
    return this.usersService.sendRequestOtp(user)
  }

  @Post('role')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign role to user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User role updated successfully' })
  async assignRoleToUser(@Body() data: UserRoleDto, @User() user: UsersDocument) {
    return this.usersService.assignRolesToUser(data.userCode, data.roleCode, user)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return list of users' })
  async getAllUsers(@Query() data: GetListDto) {
    return this.usersService.findAll(data)
  }

  @Get(':userCode')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return user details' })
  @ApiParam({
    name: 'userCode',
    description: 'ID of user to retrieve',
    example: '67287228e9647d06a5097ff6',
  })
  async getUserById(@Param('userCode') userCode: string) {
    return this.usersService.findById(userCode)
  }

  @Put(':userCode')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User updated successfully' })
  @ApiParam({
    name: 'userCode',
    description: 'ID of user to update',
    example: '67287228e9647d06a5097ff6',
  })
  async updateUser(@Param('userCode') userCode: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(userCode, updateUserDto)
  }

  @Delete(':userCode')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User deleted successfully' })
  @ApiParam({
    name: 'userCode',
    description: 'ID of user to delete',
    example: '67287228e9647d06a5097ff6',
  })
  async deleteUser(@Param('userCode') userCode: string, @User() user: UsersDocument) {
    return this.usersService.delete(userCode, user)
  }

  @Get(':userCode/profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return user profile' })
  @ApiParam({
    name: 'userCode',
    description: 'ID of user to get profile',
    example: '67287228e9647d06a5097ff6',
  })
  async getUserProfile(@Param('userCode') userCode: string) {
    return await this.usersService.getDetailUser()
  }

  @Put(':userCode/profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Profile updated successfully' })
  @ApiParam({
    name: 'userCode',
    description: 'ID of user to update profile',
    example: '67287228e9647d06a5097ff6',
  })
  async updateUserProfile(
    @Param('userCode') userCode: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userCode, updateProfileDto)
  }

  @Get(':userCode/activity')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user activity history' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return user activity history' })
  @ApiParam({
    name: 'userCode',
    description: 'ID of user to get activity',
    example: '67287228e9647d06a5097ff6',
  })
  async getUserActivity(@Param('userCode') userCode: string) {
    return this.usersService.getActivity(userCode)
  }

  @Get(':userCode/loginHistory')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user login history' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return user login history' })
  @ApiParam({
    name: 'userCode',
    description: 'ID of user to get login history',
    example: '67287228e9647d06a5097ff6',
  })
  async getLoginHistory(@Param('userCode') userCode: string) {
    return this.usersService.getLoginHistory(userCode)
  }

  @Get(':userCode/changes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user change history' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return user change history' })
  @ApiParam({
    name: 'userCode',
    description: 'ID of user to get changes',
    example: '67287228e9647d06a5097ff6',
  })
  async getUserChanges(@Param('userCode') userCode: string) {
    return this.usersService.getChanges(userCode)
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Search users' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return search results' })
  async searchUsers(@Query() searchParams: SearchUserDto) {
    return this.usersService.search(searchParams)
  }

  @Get('filter')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Filter users' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return filtered users' })
  async filterUsers(@Query() filterParams: FilterUserDto) {
    return this.usersService.filter(filterParams)
  }
}
