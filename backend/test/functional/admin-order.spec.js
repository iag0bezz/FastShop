const { test, trait } = use('Test/Suite')('Admin | Orders')

trait('Test/ApiClient')
trait('Auth/Client')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Role = use('Role')

test('it should return status 200 when return all orders', async ({ client }) => {
  const [user, role] = await Promise.all([
    Factory.model('App/Models/User').create(),
    Role.findBy('slug', 'admin')
  ])
  await user.roles().attach([role.id], null)

  const response = await client
    .get('/v1/admin/orders')
    .loginVia(user)
    .end()

  response.assertStatus(200)
})