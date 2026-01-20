export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser extends User {
  accessToken: string;
  refreshToken: string;
}
