const { test, trait } = use('Test/Suite')('Admin | Categories')

trait('Test/ApiClient')
trait('Auth/Client')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Role = use('Role')

test('it should return status 200 when return all categories', async ({ client }) => {
  const [user, role] = await Promise.all([
    Factory.model('App/Models/User').create(),
    Role.findBy('slug', 'admin')
  ])
  await user.roles().attach([role.id], null)

  const response = await client
    .get('/v1/admin/categories')
    .loginVia(user)
    .end()

  response.assertStatus(200)
})

test('it should return status 200 when create new category', async ({ client }) => {
  const [user, role] = await Promise.all([
    Factory.model('App/Models/User').create(),
    Role.findBy('slug', 'admin')
  ])
  await user.roles().attach([role.id], null)

  const categoryPayload = {
    title: 'CategoryTest',
    description: 'CategoryTest description',
    image_id: 1
  }

  const response = await client
    .post('/v1/admin/categories')
    .send(categoryPayload)
    .loginVia(user)
    .end()

  response.assertStatus(201)
})

test('it should return status 200 when show specific category', async ({ client }) => {
  const [user, role] = await Promise.all([
    Factory.model('App/Models/User').create(),
    Role.findBy('slug', 'admin')
  ])
  await user.roles().attach([role.id], null)

  const category = await Factory.model('App/Models/Category').create()

  const response = await client
    .get(`/v1/admin/categories/${category.id}`)
    .loginVia(user)
    .end()

  response.assertStatus(200)
})

test('it should return status 200 when update specific category', async ({ client }) => {
  const [user, role] = await Promise.all([
    Factory.model('App/Models/User').create(),
    Role.findBy('slug', 'admin')
  ])
  await user.roles().attach([role.id], null)

  const category = await Factory.model('App/Models/Category').create()

  const categoryPayload = {
    title: 'CategoryTestUpdate',
    description: 'CategoryTestUpdate description',
    image_id: 1
  }

  const response = await client
    .put(`/v1/admin/categories/${category.id}`)
    .send(categoryPayload)
    .loginVia(user)
    .end()

  response.assertStatus(200)
})

test('it should return status 204 when delete specific category', async ({ client }) => {
  const [user, role] = await Promise.all([
    Factory.model('App/Models/User').create(),
    Role.findBy('slug', 'admin')
  ])
  await user.roles().attach([role.id], null)

  const categoryPayload = {
      title: 'CategoryTestDelete',
      description: 'CategoryTestDelete description',
      image_id: 1
  }

  const category = await Factory.model('App/Models/Category').create(categoryPayload)

  const response = await client
    .delete(`/v1/admin/categories/${category.id}`)
    .loginVia(user)
    .end()

  response.assertStatus(204)
})