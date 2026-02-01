export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
  perfil: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}
