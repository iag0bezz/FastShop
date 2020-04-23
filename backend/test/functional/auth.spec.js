const { test, trait } = use('Test/Suite')('Authentication')

trait('Test/ApiClient')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

test('it should return status 200 when registered', async ({ client }) => {
  const sessionPayload = {
    name: 'Test',
    email: 'test@fastshop.com',
    password: 'secret'
  }

  const response = await client
    .post('/v1/auth/register')
    .send(sessionPayload)
    .end()

  response.assertStatus(200)
})

test('it should return status 200 when authenticated', async ({ client }) => {
  const sessionPayload = {
    email: 'test@fastshop.com',
    password: 'secret'
  }

  const response = await client
    .post('/v1/auth/login')
    .send(sessionPayload)
    .end()

  response.assertStatus(200)
})