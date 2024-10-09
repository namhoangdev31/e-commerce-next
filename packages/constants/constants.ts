export const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export const KEY_SESSION = 'session_token';

export enum Roles {
  Admin = 'admin',
}
export interface Sort {
  key: React.Key;
  mode: string | number;
}

export const KEYS_SORT = {
  ascend: 'asc',
  descend: 'desc',
} as const;
