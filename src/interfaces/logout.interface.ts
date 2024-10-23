export interface LogoutResponse {
  message: string;
}

export interface LogoutRepo {
  updateSessionToken(sessionId: string, token: string | null): Promise<any>;
  updateUserOnline(userId: string, status: string): Promise<any>;
  deleteManySessions(filter: any): Promise<any>;
}