import { Injectable, BadRequestException } from '@nestjs/common'
import { createClient } from '@supabase/supabase-js'
import { Multer } from 'multer'
import sharp from 'sharp'

@Injectable()
export class CdnService {
  private readonly supabase
  private readonly ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
  private readonly ALLOWED_DOC_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]
  private readonly IMAGE_BUCKET = 'images'
  private readonly DOC_BUCKET = 'documents'

  constructor() {
    this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
  }

  private async uploadToStorage(
    bucket: string,
    filePath: string,
    buffer: Buffer,
    contentType: string,
  ): Promise<string> {
    const { data, error } = await this.supabase.storage.from(bucket).upload(filePath, buffer, {
      contentType,
      cacheControl: '3600',
      upsert: false,
    })

    if (error) throw new BadRequestException(error.message)

    const { data: publicUrl } = this.supabase.storage.from(bucket).getPublicUrl(filePath)

    return publicUrl.publicUrl
  }

  private async deleteFromStorage(bucket: string, fileUrl: string): Promise<void> {
    const filePath = fileUrl.split('/').pop()
    const { error } = await this.supabase.storage.from(bucket).remove([filePath])

    if (error) throw new BadRequestException(error.message)
  }

  private generateFilePath(path: string, originalName: string): string {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    return `${path}/${timestamp}-${randomString}-${originalName}`
  }

  async uploadImage(file: Multer.File, path: string): Promise<string> {
    try {
      if (!this.ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        throw new BadRequestException(
          'Invalid file type. Only JPEG, PNG and WebP images are allowed',
        )
      }

      const optimizedBuffer = await sharp(file.buffer)
        .resize(1920, 1080, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({
          quality: 85,
          progressive: true,
          chromaSubsampling: '4:2:0',
          mozjpeg: true,
        })
        .toBuffer()

      const filePath = this.generateFilePath(path, file.originalname)
      return await this.uploadToStorage(this.IMAGE_BUCKET, filePath, optimizedBuffer, 'image/jpeg')
    } catch (error) {
      throw new BadRequestException(`Failed to upload image: ${error.message}`)
    }
  }

  async uploadDocument(file: Multer.File, path: string): Promise<string> {
    try {
      if (!this.ALLOWED_DOC_TYPES.includes(file.mimetype)) {
        throw new BadRequestException('Invalid file type. Only PDF and DOC files are allowed')
      }

      const filePath = this.generateFilePath(path, file.originalname)
      return await this.uploadToStorage(this.DOC_BUCKET, filePath, file.buffer, file.mimetype)
    } catch (error) {
      throw new BadRequestException(`Failed to upload document: ${error.message}`)
    }
  }

  async deleteImage(fileUrl: string): Promise<void> {
    try {
      await this.deleteFromStorage(this.IMAGE_BUCKET, fileUrl)
    } catch (error) {
      throw new BadRequestException(`Failed to delete image: ${error.message}`)
    }
  }

  async deleteDocument(fileUrl: string): Promise<void> {
    try {
      await this.deleteFromStorage(this.DOC_BUCKET, fileUrl)
    } catch (error) {
      throw new BadRequestException(`Failed to delete document: ${error.message}`)
    }
  }

  async getImage(fileUrl: string): Promise<Buffer> {
    try {
      const filePath = fileUrl.split('/').pop()
      const { data, error } = await this.supabase.storage.from(this.IMAGE_BUCKET).download(filePath)

      if (error) {
        throw new BadRequestException('File not found')
      }

      return Buffer.from(await data.arrayBuffer())
    } catch (error) {
      throw new BadRequestException(`Failed to get image: ${error.message}`)
    }
  }
}
