import { Controller, Post, UploadedFile, UseInterceptors, Delete, Param } from '@nestjs/common'
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { Public } from '../auth/decorators/public.decorator'
import { FileInterceptor } from '@nestjs/platform-express'
import { CdnService } from './cdn-service.service'

@Controller('cdn-service')
@ApiTags('CDN Service')
export class CdnServiceController {
  constructor(private readonly cdnService: CdnService) {}

  @Post('upload-image')
  @ApiConsumes('multipart/form-data')
  @Public()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file) {
    return this.cdnService.uploadImage(file, 'images')
  }

  @Post('upload-document')
  @ApiConsumes('multipart/form-data')
  @Public()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(@UploadedFile() file) {
    return this.cdnService.uploadDocument(file, 'documents')
  }

  @Delete('delete-image/:url')
  @Public()
  async deleteImage(@Param('url') url: string) {
    return this.cdnService.deleteImage(url)
  }

  @Delete('delete-document/:url')
  @Public()
  async deleteDocument(@Param('url') url: string) {
    return this.cdnService.deleteDocument(url)
  }
}
