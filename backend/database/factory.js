'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

Factory.blueprint('App/Models/User', (faker, i, data = {}) => {
    return {
        name: faker.name(),
        email: faker.email({ domain: 'fastshop.com' }),
        password: 'secret',
        ...data
    }
})

Factory.blueprint('App/Models/Category', (faker, i, data = {}) => {
    return {
        title: faker.country({ full: true }),
        description: faker.sentence(),
        image_id: 1,
        ...data
    }
})

Factory.blueprint('App/Models/Product', (faker, i, data = {}) => {
    return {
        name: faker.animal(),
        description: faker.sentence(),
        price: faker.floating({ min: 0, max: 1000, fixed: 2 }),
        image_id: 1,
        ...data
    }
})

Factory.blueprint('App/Models/Order', (faker, i, data = {}) => {
    return {
        total: faker.floating({ min: 0, max: 1000, fixed: 2 }),
        user_id: 1,
        ...data
    }
})