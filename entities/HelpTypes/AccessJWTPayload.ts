type AccessJWTPayload = {
  id: number
  user: string
  email: string
  iat: number
  exp: number
}

export default AccessJWTPayload
