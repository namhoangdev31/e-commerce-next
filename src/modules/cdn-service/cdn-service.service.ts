import { Injectable } from '@nestjs/common'
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase'
import { Multer } from 'multer'
import sharp from 'sharp'

@Injectable()
export class CdnService {
  constructor(@InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin) {}

  async uploadImage(file: Multer.File, path: string): Promise<string> {
    try {
      const bucket = this.firebase.storage.bucket()

      const optimizedBuffer = await sharp(file.buffer)
        .resize(1920, 1080, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 80 })
        .toBuffer()

      const fileName = `${Date.now()}-${file.originalname}`
      const filePath = `${path}/${fileName}`

      const fileUpload = bucket.file(filePath)

      const stream = fileUpload.createWriteStream({
        metadata: {
          contentType: 'image/jpeg',
          cacheControl: 'public, max-age=31536000',
          metadata: {
            firebaseStorageDownloadTokens: Date.now().toString(),
          },
        },
        resumable: false,
      })

      return new Promise((resolve, reject) => {
        stream.on('error', error => {
          reject(error)
        })

        stream.on('finish', async () => {
          await fileUpload.makePublic()

          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`
          resolve(publicUrl)
        })

        stream.end(optimizedBuffer)
      })
    } catch (error) {
      throw new Error(`Failed to upload image: ${error.message}`)
    }
  }

  async uploadDocument(file: Multer.File, path: string): Promise<string> {
    try {
      const bucket = this.firebase.storage.bucket()

      // Validate file type
      if (!file.mimetype.includes('pdf') && !file.mimetype.includes('document')) {
        throw new Error('Invalid file type. Only PDF and DOC files are allowed')
      }

      const fileName = `${Date.now()}-${file.originalname}`
      const filePath = `${path}/${fileName}`

      const fileUpload = bucket.file(filePath)

      const stream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      })

      return new Promise((resolve, reject) => {
        stream.on('error', error => {
          reject(error)
        })

        stream.on('finish', async () => {
          await fileUpload.makePublic()
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`
          resolve(publicUrl)
        })

        stream.end(file.buffer)
      })
    } catch (error) {
      throw new Error(`Failed to upload document: ${error.message}`)
    }
  }

  async deleteImage(fileUrl: string): Promise<void> {
    try {
      const bucket = this.firebase.storage.bucket()
      const fileName = fileUrl.split('/').pop()
      const file = bucket.file(fileName)

      await file.delete()
    } catch (error) {
      throw new Error(`Failed to delete image: ${error.message}`)
    }
  }

  async deleteDocument(fileUrl: string): Promise<void> {
    try {
      const bucket = this.firebase.storage.bucket()

      // Extract file path from URL
      const fileName = fileUrl.split('/').pop()
      const file = bucket.file(fileName)

      await file.delete()
    } catch (error) {
      throw new Error(`Failed to delete document: ${error.message}`)
    }
  }
}
