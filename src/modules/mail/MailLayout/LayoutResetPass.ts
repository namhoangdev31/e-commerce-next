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
        <h1>Xin chào ${user.username || 'Valued User'}!</h1>
        <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Mã OTP (One-Time Password) của bạn là:</p>
        <div class="otp">${otp}</div>
        <p>Mật khẩu mới của bạn là : ${termPass}. Vui lòng sử dụng nó để đặt lại mật khẩu của bạn.</p>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này và liên hệ với chúng tôi ngay lập tức.</p>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Công ty của bạn. Tất cả các quyền được bảo lưu.</p>
        </div>
    </div>
    </body>
    </html>
  `
}
