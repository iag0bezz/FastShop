'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Product = use('App/Models/Product')

const Database = use('Database')

/**
 * Resourceful controller for interacting with products
 */
class ProductController {
  /**
   * Show a list of all products.
   * GET products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view, pagination }) {
    const products = await Product.query()
      .with('categories', category => category.select(['id', 'title', 'description', 'image_id'])).orderBy('id', 'DESC').paginate(pagination.page, pagination.limit)

    const count = await Database.from('products').count() 

    response.header('X-Total-Count', count[0]['count(*)'])

    return response.send(products)
  }

  /**
   * Create/save a new product.
   * POST products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const { name, description, price, image_id, categories } = await request.all()

    const product = await Product.create({ name, description, price, image_id })

    await product.categories().attach(categories)

    return response.status(201).send(product)
  }

  /**
   * Display a single product.
   * GET products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params: { id }, request, response, view }) {
    const query = Product.query()

    const product = await query.where('id', id).with('categories', category => category.select(['id', 'title', 'description', 'image_id'])).first()
    
    if(product == null){
      return response.status(404).send({
        errror: 'Não foi possível encontrar este item.'
      })
    }

    return response.send(product)
  }

  /**
   * Update product details.
   * PUT or PATCH products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params: { id }, request, response }) {
    const product = await Product.findOrFail(id)

    const { name, description, price, image_id, categories } = request.all()

    product.merge({ name, description, price, image_id })
    
    await Promise.all([
      product.categories().detach(),
      product.categories().attach(categories),
      product.save()
    ])

    return response.status(200).send(product)
  }

  /**
   * Delete a product with id.
   * DELETE products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params: { id }, request, response }) {
    const product = await Product.findOrFail(id)

    await product.delete()

    return response.status(204).send()
  }

}

module.exports = ProductController
