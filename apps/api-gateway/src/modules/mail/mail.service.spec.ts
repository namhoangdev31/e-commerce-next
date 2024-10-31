import { Test, TestingModule } from '@nestjs/testing'
import { MailService } from './mail.service' // Adjust path as needed
import { MailerService } from '@nestjs-modules/mailer' // Adjust if your MailerService is from a different package

describe('MailService', () => {
  let mailService: MailService

  // Create a mock for the MailerService
  const mockMailerService = {
    sendMail: jest.fn().mockResolvedValue(true), // Mock implementation
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: MailerService, useValue: mockMailerService }, // Provide the mock here
      ],
    }).compile()

    mailService = module.get<MailService>(MailService)
  })

  it('should be defined', () => {
    expect(mailService).toBeDefined()
  })

  // Add more tests as needed
})
