export const verifyEmailNotification = (action: string) => ({
  title: 'Verifica tu correo electrónico',
  color: 'red',
  message: `Debes verificar tu correo electrónico para poder ${action}`,
})
