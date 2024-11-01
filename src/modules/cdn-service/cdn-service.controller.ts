import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { ApiBody, ApiConsumes } from '@nestjs/swagger'
import { Public } from '../auth/decorators/public.decorator'
import { FileInterceptor } from '@nestjs/platform-express'
import { CdnService } from './cdn-service.service'

@Controller('cdn-service')
export class CdnServiceController {
  constructor(private readonly cdnService: CdnService) {}

  @Post('upload')
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
  async uploadFile(@UploadedFile() file) {
    return this.cdnService.uploadImage(file, 'images')
  }
}
