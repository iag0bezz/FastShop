'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Order = use('App/Models/Order')

const Database = use('Database')

/**
 * Resourceful controller for interacting with orders
 */
class OrderController {
  /**
   * Show a list of all orders.
   * GET orders
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view, pagination }) {
    const orders = await Order.query()
      .with('items', orderItem => 
        orderItem.with('product', product => product.select(['id', 'name', 'description', 'price', 'image_id'])))
          .paginate(pagination.page, pagination.limit)
      
    const count = await Database.from('orders').count() 

    response.header('X-Total-Count', count[0]['count(*)'])

    return response.status(200).send(orders)
  }

  /**
   * Create/save a new order.
   * POST orders
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    return response.status(400).send({
      error: 'Esta operação é exclusiva no painel do cliente.'
    })
  }

  /**
   * Display a single order.
   * GET orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params: { id }, request, response, view }) {
  }

  /**
   * Update order details.
   * PUT or PATCH orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    return response.status(400).send({
      error: 'Esta operação está desativada.'
    })
  }

  /**
   * Delete a order with id.
   * DELETE orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params: { id }, request, response }) {
  }

}

module.exports = OrderController
