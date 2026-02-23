import { getHeaders } from '../../support/api/headers'

const apiBaseUrl = Cypress.env('API_BASE_URL')

describe('Users API', () => {
  it('GET - should return code 200 and valid paginated schema', () => {
    cy.request({
      method: 'GET',
      url: `${apiBaseUrl}/users`,
      qs: { page: 2 },
      headers: getHeaders(),
    }).then(({ status, body }) => {
      // Assert status code
      expect(status).to.eq(200)

      // Assert "total"
      expect(body).to.have.property('total')

      // Assert last_name for first and second user
      // First user
      expect(body.data[0]).to.have.property('last_name')
      expect(body.data[0].last_name).not.to.be.empty
      expect(body.data[0].last_name).to.eq('Lawson')

      // Second user
      expect(body.data[1]).to.have.property('last_name')
      expect(body.data[1].last_name).not.to.be.empty
      expect(body.data[1].last_name).to.eq('Ferguson')

      // Assert "total" is greater than the number of users returned
      // expect(body.data.length).to.eq(body.total)
      expect(body.total).to.be.greaterThan(body.data.length)

      // Pages types
      expect(body.page).to.be.a('number')
      expect(body.per_page).to.be.a('number')
      expect(body.total).to.be.a('number')
      expect(body.total_pages).to.be.a('number')
      expect(body.data).to.be.an('array')

      // User object types
      body.data.forEach((u: any) => {
        expect(u.id).to.be.a('number')
        expect(u.email).to.be.a('string').and.not.be.empty
        expect(u.first_name).to.be.a('string').and.not.be.empty
        expect(u.last_name).to.be.a('string').and.not.be.empty
        expect(u.avatar).to.be.a('string').and.not.be.empty
      })
    })
  })

  it('POST - should return code 201 and valid response schema', () => {
    cy.fixture('create-users').then((users) => {
      users.forEach((userData: any) => {
        cy.request({
          method: 'POST',
          url: `${apiBaseUrl}/users`,
          body: userData,
          headers: getHeaders(),
        }).then(({ body, duration, status }) => {
          // Assert status code
          expect(status).to.eq(201)

          // Response schema
          expect(body).to.include.all.keys('id', 'createdAt', 'name', 'job')
          expect(body.id).to.be.a('string')
          expect(body.createdAt).to.be.a('string')
          expect(body.name).to.be.a('string')
          expect(body.job).to.be.a('string')

          // Assert ID
          expect(body.id).not.be.empty

          // Assert createdAt timestamp
          expect(body.createdAt).not.be.empty
          expect(Date.parse(body.createdAt)).to.not.be.NaN

          // Assert response time
          expect(duration).to.be.lessThan(Cypress.env('RESPONSE_TIME_LIMIT'))
        })
      })
    })
  })
})
