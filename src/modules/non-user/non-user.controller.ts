import { Controller, Post, Body, HttpCode, HttpStatus, Param, Req } from '@nestjs/common'
import { NonUserService } from './non-user.service'
import { CreateNonUserDto, GuestDto } from './dto/create-non-user.dto'
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { Public } from '../auth/decorators/public.decorator'

@Controller({
  path: 'guest',
  version: '1',
})
@Public()
export class NonUserController {
  constructor(private readonly nonUserService: NonUserService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register as guest user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Guest registered successfully' })
  async registerGuest(@Body() createNonUserDto: CreateNonUserDto) {
    return this.nonUserService.create(createNonUserDto)
  }

  @Public()
  @Post('groups/public')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get public groups' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Retrieved public groups' })
  async getPublicGroups(@Body() guestDto: GuestDto) {
    return this.nonUserService.getPublicGroups(guestDto)
  }

  @Public()
  @Post('groups/public/:groupCode')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get public group details' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Retrieved public group details' })
  async getPublicGroupDetails(@Body() guestDto: GuestDto, @Param('groupCode') groupCode: string) {
    return this.nonUserService.getPublicGroupDetails(groupCode)
  }

  @Public()
  @Post('lessons/preview')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get preview lessons' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Retrieved preview lessons' })
  async getPreviewLessons(@Body() guestDto: GuestDto) {
    return this.nonUserService.getPreviewLessons(guestDto)
  }

  @Public()
  @Post('lessons/preview/:lessonId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get preview lesson details' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Retrieved preview lesson details' })
  async getPreviewLessonDetails(@Body() guestDto: GuestDto, @Param('lessonId') lessonId: string) {
    return this.nonUserService.getPreviewLessonDetails(lessonId)
  }

  @Public()
  @Post('courses/featured')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get featured courses' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Retrieved featured courses' })
  async getFeaturedCourses(@Body() guestDto: GuestDto) {
    return this.nonUserService.getFeaturedCourses(guestDto)
  }

  @Public()
  @Post('courses/featured/:courseId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get featured course details' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Retrieved featured course details' })
  async getFeaturedCourseDetails(@Body() guestDto: GuestDto, @Param('courseId') courseId: string) {
    return this.nonUserService.getFeaturedCourseDetails(courseId)
  }
}
