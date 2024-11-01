import { Injectable } from '@nestjs/common'
import { Course, Prisma } from '@prisma/client'
import { PrismaService } from '../../shared/prisma-service/prisma-service.service'

@Injectable()
export class CoursesRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CourseCreateInput): Promise<Course> {
    return this.prisma.course.create({ data })
  }

  async findAll(): Promise<Course[]> {
    return this.prisma.course.findMany()
  }

  async findOne(id: number): Promise<Course | null> {
    return this.prisma.course.findUnique({ where: { id } })
  }

  async findByElementId(elementId: number): Promise<Course | null> {
    return this.prisma.course.findUnique({ where: { elementId } })
  }

  async update(id: number, data: Prisma.CourseUpdateInput): Promise<Course> {
    return this.prisma.course.update({
      where: { id },
      data,
    })
  }

  async remove(id: number): Promise<Course> {
    return this.prisma.course.delete({ where: { id } })
  }

  async findWithRelations(id: number): Promise<Course | null> {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        parentElement: true,
        childElements: true,
        contentItems: true,
        prerequisites: true,
        prerequisiteFor: true,
        releaseRules: true,
        learningActivities: true,
        assessments: true,
        pathCourses: true,
        learnerProgresses: true,
      },
    })
  }

  async findByParentElementId(parentElementId: number): Promise<Course[]> {
    return this.prisma.course.findMany({
      where: { parentElementId },
    })
  }

  async findByElementType(elementType: Prisma.EnumElementTypeFilter): Promise<Course[]> {
    return this.prisma.course.findMany({
      where: { elementType },
    })
  }
}
