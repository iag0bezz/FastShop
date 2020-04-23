'use strict'

/*
|--------------------------------------------------------------------------
| RoleSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const Role = use('Role')

class RoleSeeder {
  async run () {

    await Role.create({
      name: 'Administrador',
      slug: 'admin',
      description: 'Administrador do sistema.'
    })

    await Role.create({
      name: 'Usuário',
      slug: 'user',
      description: 'Usuário do sistema.'
    })

  }
}

module.exports = RoleSeeder
