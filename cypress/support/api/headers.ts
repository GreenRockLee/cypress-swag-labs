export const getHeaders = () => {
  const apiKey = Cypress.env('API_KEY')

  if (!apiKey) {
    throw new Error('API_KEY is not defined in Cypress environment')
  }

  return {
    'x-api-key': apiKey,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
}
