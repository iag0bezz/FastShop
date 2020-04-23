'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Order = use('App/Models/Order')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const OrderPayment = use('App/Models/OrderPayment')

const Database = use('Database')

const OrderService = use('App/Services/OrderService')

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
   */
  async index ({ request, response, auth, pagination }) {
    const user = await auth.getUser()

    const orders = await Order.query().where('user_id', user.id)
      .with('payment', payment =>{
        payment.select(['id', 'order_id', 'payId', 'status'])
      })
      .with('items', orderItem => 
        orderItem.with('product', product => product.select(['id', 'name', 'description', 'price', 'image_id'])))
          .paginate(pagination.page, pagination.limit)

    const count = await Database.select('user_id', user.id).from('orders').count() 

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
  async store ({ request, response, auth }) {
    const user = await auth.getUser()

    const { items } = request.all()

    var order = await Order.create({ user_id: user.id })

    const service = new OrderService(order)

    if(items && items.length > 0){
      await service.fetchItems(items)
    }

    const paymentDetails = await service.fetchPayment(items)

    if(paymentDetails == null || paymentDetails.httpStatusCode != 201) {
      await order.delete()
      await order.items().delete()
      return response.status(400).send({
        error: 'Ocorreu um erro ao gerar seu pagamento!'
      })
    }

    await OrderPayment.create(
      {
        order_id: order.id,
        payId: paymentDetails.id
      }
    )

    order = await Order.query().where('id', order.id)
      .with('payment', payment =>{
        payment.select(['id', 'order_id', 'payId', 'status'])
      })
      .with('items', orderItem => 
          orderItem.with('product', product => product.select(['id', 'name', 'description', 'price', 'image_id']) )
            ).first()

    for (let i = 0; i < paymentDetails.links.length; i++) {
      if (paymentDetails.links[i].rel === 'approval_url') {
        order.paymentUrl = paymentDetails.links[i].href
      }
    }

    return response.status(201).send(order)
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
  async show ({ params: { id }, request, response, auth }) {
    const user = await auth.getUser()

    const query = Order.query()

    const order = await query.where('id', id)
              .with('payment', payment =>{
                payment.select(['id', 'order_id', 'payId', 'status'])
              })
              .with('items', orderItem => 
                  orderItem.with('product', product => product.select(['id', 'name', 'description', 'price', 'image_id']) )
                    ).first()

    if(order == null){
      return response.status(404).send({
        errror: 'Não foi possível encontrar este item.'
      })
    } 

    if(order.user_id != user.id){
      return response.status(401).send({
        error: 'Você não tem permissão para ver este pedido.'
      })
    }

    return response.status(200).send(order)     
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
      error: 'Não é possível editar um pedido.'
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
  async destroy ({ params, request, response }) {
    return response.status(400).send({
      error: 'Não é possível excluir um pedido.'
    })
  }

}

module.exports = OrderController
