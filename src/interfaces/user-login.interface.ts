export interface UserLoginInterface {
  user?: User
  iat?: number
  exp?: number
}

export interface User {
  id?: string
  email?: string
  roleCode?: string
  firstName?: string
  lastName?: string
  isValidateEmail?: boolean
  session?: Session
}

export interface Session {
  sessionId?: string
  userCode?: string
  expiresAt?: Date
  userAgent?: string
  ipAddress?: string
  isRevoked?: boolean
  lastActiveAt?: Date
  isOnline?: boolean
}
