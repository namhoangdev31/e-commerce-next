import { Expression, Types } from 'mongoose';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  id: Types.ObjectId;
}
