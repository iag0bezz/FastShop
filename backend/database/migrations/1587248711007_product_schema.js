'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductSchema extends Schema {
  up () {
    this.create('products', (table) => {
      table.increments()

      table.string('name', 100).notNullable()
      table.string('description', 255).notNullable()
      table.decimal('price', 12, 2)
      table.integer('image_id').unsigned()

      table
        .foreign('image_id')
        .references('id')
        .inTable('images')
        .onDelete('cascade')

      table.timestamps()
    })

    this.create('category_product', table => {
      table.increments()

      table.integer('product_id').unsigned()
      table.integer('category_id').unsigned()

      table
        .foreign('product_id')
        .references('id')
        .inTable('products')
        .onDelete('cascade')

      table
        .foreign('category_id')
        .references('id')
        .inTable('categories')
        .onDelete('cascade')
    })
  }

  down () {
    this.drop('category_product')
    this.drop('products')
  }
}

module.exports = ProductSchema
