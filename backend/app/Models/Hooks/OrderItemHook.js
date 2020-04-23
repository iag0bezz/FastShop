'use strict'

const OrderItemHook = exports = module.exports = {}

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Product = use('App/Models/Product')

OrderItemHook.update = async (model) => {
    const product = await Product.find(model.product_id)

    model.subtotal = model.quantity * product.price
}