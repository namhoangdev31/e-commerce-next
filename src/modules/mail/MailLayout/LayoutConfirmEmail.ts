import { UsersDocument } from '../../../database/schemas/users.schema'

export const LayoutConfirmEmail = (user: UsersDocument, otp: string): string => {
  return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your OTP Code</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: auto;
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              }
              h1 {
                color: #333;
              }
              p {
                color: #555;
                line-height: 1.5;
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
            <p>Thank you for using our service. Your OTP (One-Time Password) is:</p>
            <div class="otp">${otp}</div>
            <p>This OTP is valid for 10 minutes. Please use it to complete your login or transaction.</p>
            <p>If you did not request this OTP, please ignore this email.</p>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
            </div>
        </div>
        </body>
        </html>
      `
}
