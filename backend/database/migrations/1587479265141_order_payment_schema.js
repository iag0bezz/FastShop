'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrderPaymentSchema extends Schema {
  up () {
    this.create('order_payments', (table) => {
      table.increments()

      table.integer('order_id').unsigned()
      table.string('payId')
      table.enum('status', [
        'pending',
        'cancelled',
        'shipped',
        'paid',
        'finished',
        'failed'
      ]).defaultTo('pending')

      table
        .foreign('order_id')
        .references('id')
        .inTable('orders')
        .onDelete('cascade')

      table.timestamps()
    })
  }

  down () {
    this.drop('order_payments')
  }
}

module.exports = OrderPaymentSchema
