const { test, trait } = use('Test/Suite')('Client | Orders')

trait('Test/ApiClient')
trait('Auth/Client')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Role = use('Role')

test('it should return status 200 on return all client orders', async ({ client }) => {
  const [user, role] = await Promise.all([
    Factory.model('App/Models/User').create(),
    Role.findBy('slug', 'user')
  ])
  await user.roles().attach([role.id], null)

  const response = await client
    .get('/v1/client/orders')
    .loginVia(user)
    .end()

  response.assertStatus(200)
})

test('it should return status 201 when create new order', async ({ assert, client }) => {
  const [user, role] = await Promise.all([
    Factory.model('App/Models/User').create(),
    Role.findBy('slug', 'user')
  ])
  await user.roles().attach([role.id], null)

  const product = await Factory.model('App/Models/Product').create()

  const orderPayload = {
    items: [
      {
        product_id: product.id,
        quantity: 1
      }
    ]
  }

  const response = await client
    .post('/v1/client/orders')
    .send(orderPayload)
    .loginVia(user)
    .end()

  response.assertStatus(201)
  assert.exists(response.body.paymentUrl)
})

test('it sohuld return status 200 when show specific order', async ({ client }) => {
  const [user, role] = await Promise.all([
    Factory.model('App/Models/User').create(),
    Role.findBy('slug', 'user')
  ])
  await user.roles().attach([role.id], null)

  const orderPayload = {
    user_id: user.id
  }

  const order = await Factory.model('App/Models/Order').create(orderPayload)

  const response = await client
    .get(`/v1/client/orders/${order.id}`)
    .loginVia(user)
    .end()

  response.assertStatus(200)
})