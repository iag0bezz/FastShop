'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CategorySchema extends Schema {
  up () {
    this.create('categories', (table) => {
      table.increments()
      
      table.string('title', 100).notNullable().unique()
      table.string('description', 255).notNullable()
      table.integer('image_id').unsigned()

      table
        .foreign('image_id')
        .references('id')
        .inTable('images')
        .onDelete('cascade')

      table.timestamps()
    })
  }

  down () {
    this.drop('categories')
  }
}

module.exports = CategorySchema
