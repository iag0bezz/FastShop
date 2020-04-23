const { test, trait } = use('Test/Suite')('Admin | Products')

trait('Test/ApiClient')
trait('Auth/Client')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Role = use('Role')

test('it should return status 200 when return all products', async ({ client }) => {
  const [user, role] = await Promise.all([
    Factory.model('App/Models/User').create(),
    Role.findBy('slug', 'admin')
  ])
  await user.roles().attach([role.id], null)

  const response = await client
    .get('/v1/admin/products')
    .loginVia(user)
    .end()

  response.assertStatus(200)
})

test('it should return status 200 when create new product', async ({ client }) => {
  const [user, role] = await Promise.all([
    Factory.model('App/Models/User').create(),
    Role.findBy('slug', 'admin')
  ])
  await user.roles().attach([role.id], null)

  const category = await Factory.model('App/Models/Category').create()

  const productPayload = {
    name: 'ProductTest',
    description: 'ProductTest description',
    price: 10,
    image_id: 1,
    categories: [category.id]
  }

  const response = await client
    .post('/v1/admin/products')
    .send(productPayload)
    .loginVia(user)
    .end()

  response.assertStatus(201)
})

test('it should return status 200 when show specific product', async ({ client }) => {
  const [user, role] = await Promise.all([
    Factory.model('App/Models/User').create(),
    Role.findBy('slug', 'admin')
  ])
  await user.roles().attach([role.id], null)

  const product = await Factory.model('App/Models/Product').create()

  const response = await client
    .get(`/v1/admin/products/${product.id}`)
    .loginVia(user)
    .end()

  response.assertStatus(200)
})

test('it should return status 200 when update specific product', async ({ client }) => {
  const [user, role] = await Promise.all([
    Factory.model('App/Models/User').create(),
    Role.findBy('slug', 'admin')
  ])
  await user.roles().attach([role.id], null)

  const [product, category] = await Promise.all([
    Factory.model('App/Models/Product').create(),
    Factory.model('App/Models/Category').create()
  ])

  const productPayload = {
    title: 'ProductTestUpdate',
    description: 'ProductTestUpdate description',
    price: 10,
    image_id: 1,
    categories: [category.id]
  }

  const response = await client
    .put(`/v1/admin/products/${product.id}`)
    .send(productPayload)
    .loginVia(user)
    .end()

  response.assertStatus(200)
})

test('it should return status 204 when delete specific product', async ({ client }) => {
  const [user, role] = await Promise.all([
    Factory.model('App/Models/User').create(),
    Role.findBy('slug', 'admin')
  ])
  await user.roles().attach([role.id], null)

  const product = await Factory.model('App/Models/Product').create()

  const response = await client
    .delete(`/v1/admin/products/${product.id}`)
    .loginVia(user)
    .end()

  response.assertStatus(204)
})