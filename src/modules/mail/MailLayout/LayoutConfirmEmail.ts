import { UsersDocument } from '../../../database/schemas/users.schema'

export const LayoutConfirmEmail = (user: UsersDocument, otp: string): string => {
  return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Mã OTP của bạn</title>
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
            <h1>Xin chào ${user.username || 'Valued User'}!</h1>
            <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Mã OTP (One-Time Password) của bạn là:</p>
            <div class="otp">${otp}</div>
            <p>Mã OTP này có hiệu lực trong 10 phút. Vui lòng sử dụng nó để hoàn tất đăng nhập hoặc giao dịch của bạn.</p>
            <p>Nếu bạn không yêu cầu mã OTP này, vui lòng bỏ qua email này.</p>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Công ty của bạn. Tất cả các quyền được bảo lưu.</p>
            </div>
        </div>
        </body>
        </html>
      `
}
