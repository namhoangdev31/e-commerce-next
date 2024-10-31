export interface HeaderGetAll {
  data: DataPayLoad[];
}

export interface DataPayLoad {
  id: string;
  navItems: NavItemPayload[];
  logo_url: string;
  createdAt?: Date;
}

export interface NavItemPayload {
  label: string;
  url: string;
  position: number;
}
