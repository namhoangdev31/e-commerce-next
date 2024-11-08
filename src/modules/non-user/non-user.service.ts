import { Injectable } from '@nestjs/common'
import { CreateNonUserDto, GuestDto } from './dto/create-non-user.dto'
import process from 'process'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class NonUserService {
  constructor(private readonly jwtService: JwtService) {}
  create(createNonUserDto: CreateNonUserDto) {
    return 'This action adds a new guest user'
  }

  async getPublicGroups(guestDto: GuestDto) {
    try {
      // Decode base64 first
      const base64Decoded = Buffer.from(guestDto.jwtToken, 'base64').toString()

      const decodedToken = this.jwtService.verify(base64Decoded, {
        secret: process.env.JWT_SECRET,
      })

      return {
        data: `This action returns public groups and kids groups for decoded token: ${JSON.stringify(
          decodedToken,
        )}`,
      }
    } catch (error) {
      throw new Error('Invalid token' + `${error.toString()}`)
    }
  }

  getPublicGroupDetails(groupId: string) {
    return `This action returns details of public group ${groupId}`
  }

  getPreviewLessons(guestDto: GuestDto) {
    return `This action returns preview lessons`
  }

  getPreviewLessonDetails(lessonId: string) {
    return `This action returns details of preview lesson ${lessonId}`
  }

  getFeaturedCourses(guestDto: GuestDto) {
    return `This action returns featured courses`
  }

  getFeaturedCourseDetails(courseId: string) {
    return `This action returns details of featured course ${courseId}`
  }
}
