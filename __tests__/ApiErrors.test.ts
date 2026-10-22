import ApiErrors from 'utils/string/ApiErrors'

describe('ApiErrors.message', () => {
  it('should return the API message', () => {
    const error = Object.assign(new Error('Request failed with status code 400'), {
      response: { data: { message: 'Este usuario ya ha sido invitado' } },
    })

    expect(ApiErrors.message(error, 'Error')).toBe('Este usuario ya ha sido invitado')
  })

  it.each([
    ['there is no response', new Error('Network Error')],
    [
      'the message is not a string',
      Object.assign(new Error('Bad Request'), { response: { data: { message: ['a', 'b'] } } }),
    ],
  ])('should return the fallback when %s', (_, error) => {
    expect(ApiErrors.message(error, 'Inténtalo más tarde')).toBe('Inténtalo más tarde')
  })
})
