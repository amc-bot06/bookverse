export interface JwtPayload {
  userId: string
  email: string
  username: string
}

export interface SignupInput {
  username: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}