export interface RegisterModel {
  email: string,
  password: string,
  name: string
}

export interface LoginModel {
  email: string,
  password: string,
}

export interface AuthResponse {
  token: string;
  username: string;
}

export interface UserModel {
  email: string,
  password: string,
  token: string
}