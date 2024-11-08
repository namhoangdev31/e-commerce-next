import { BadRequestException, Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import { UsersDocument } from '../../database/schemas/users.schema'
import { LayoutResetPass } from './MailLayout/LayoutResetPass'
import { LayoutConfirmEmail } from './MailLayout/LayoutConfirmEmail'

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserConfirmation(user: any, token: string) {
    const url = `example.com/auth/confirm?token=${token}`

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to My App! Confirm your Email',
      template: './confirmation',
      context: {
        name: user.name,
        url,
      },
    })
  }

  async sendUserOTP(user: UsersDocument, otp: string): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Your OTP for My App',
        html: LayoutConfirmEmail(user, otp),
      })
      return true
    } catch (error) {
      console.error('Error sending OTP email:', error)
      return false
    }
  }

  async sendMailForReset(user: UsersDocument, otp: string, termPass: string): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Reset your pass',
        html: LayoutResetPass(user, otp, termPass),
      })
      return true
    } catch (error) {
      console.error('Error sending reset password email:', error)
      return false
    }
  }

  async sendVerificationEmail(user: UsersDocument, token: string): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Verify your email',
      html: LayoutConfirmEmail(user, token),
    })
  }

  async sendPasswordResetEmail(user: UsersDocument, otp: string, termPass: string): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset your password',
      html: LayoutResetPass(user, otp, termPass),
    })
  }
}
