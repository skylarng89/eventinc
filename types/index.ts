export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff'
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}