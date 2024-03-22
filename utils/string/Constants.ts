//////////// CONSTANT INFO TOOLS ////////////

// Routes that don't need auth
// Also don't have navigation and search bars
const noAuthRoutes = [
  '/account/forgotPassword',
  '/account/login',
  '/account/register',
  '/account/resetpassword',
  '/account/verifyEmail',
]

const Constants = { noAuthRoutes }
export default Constants
