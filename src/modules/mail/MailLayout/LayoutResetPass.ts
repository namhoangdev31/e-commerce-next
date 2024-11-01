import { UsersDocument } from '../../../database/schemas/users.schema'

export const LayoutResetPass = (user: UsersDocument, otp: string, termPass: string): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            h1 {
                color: #2c3e50;
            }
            .otp {
                font-size: 24px;
                font-weight: bold;
                color: #28a745;
                margin: 20px 0;
                padding: 10px;
                border: 1px solid #d4edda;
                background-color: #c3e6cb;
                border-radius: 5px;
            }
            .footer {
                margin-top: 20px;
                font-size: 12px;
                color: #777;
            }
        </style>
    </head>
    <body>
    <div class="container">
        <h1>Hello ${user.username || 'Valued User'}!</h1>
        <p>We have received a password reset request for your account. Your OTP (One-Time Password) is:</p>
        <div class="otp">${otp}</div>
        <p>Your new password is: ${termPass}. Please use it to reset your password.</p>
        <p>If you did not request a password reset, please ignore this email and contact us immediately.</p>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
    </div>
    </body>
    </html>
  `
}
