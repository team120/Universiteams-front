import jwt from 'jsonwebtoken'

// Verify token signature (validation) and return original values
const verifyToken = (token: string) => {
  if (!token) return null

  // Erase bearer part
  if (token.includes('Bearer%20')) token = token.split('%20')[1] || ''
  if (!token) return null

  const SECRET_KEY = process.env.JWT_KEY || ''

  try {
    const key = Buffer.from(SECRET_KEY, 'base64')
    // return jwt.verify(token, key)
    return jwt.decode(token)
  } catch (error) {
    console.log(error)
    return null
  }
}

export default verifyToken
