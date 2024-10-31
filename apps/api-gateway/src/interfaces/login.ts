import { Expression, Types } from 'mongoose'

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string | null
  id: Types.ObjectId
}
