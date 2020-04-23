'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Category = use('App/Models/Category')

const Database = use('Database')

/**
 * Resourceful controller for interacting with categories
 */
class CategoryController {
  /**
   * Show a list of all categories.
   * GET categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view, pagination }) {
    const categories = await Category.query()
      .with('products', product => product.select(['id', 'name', 'description', 'price', 'image_id']))
      .orderBy('id', 'DESC').paginate(pagination.page, pagination.limit)

    const count = await Database.from('categories').count() 

    response.header('X-Total-Count', count[0]['count(*)'])

    return response.status(200).send(categories)
  }

  /**
   * Create/save a new category.
   * POST categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const { title, description, image_id } = await request.all()

    const category = await Category.create({ title, description, image_id })

    return response.status(201).send(category)
  }

  /**
   * Display a single category.
   * GET categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params: { id }, request, response, view }) {
    const query = Category.query()

    const category = await query.where('id', id).with('products', product => product.select(['id', 'name', 'description', 'price', 'image_id'])).first()
    
    if(category == null){
      return response.status(404).send({
        errror: 'Não foi possível encontrar este item.'
      })
    }

    return response.status(200).send(category)
  }

  /**
   * Update category details.
   * PUT or PATCH categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params: { id }, request, response }) {
    const category = await Category.findOrFail(id)

    const { title, description, image_id } = request.all()

    category.merge({ title, description, image_id })
    await category.save()

    return response.status(200).send(category)
  }

  /**
   * Delete a category with id.
   * DELETE categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params: { id }, request, response }) {
    const category = await Category.findOrFail(id)

    await category.delete()

    return response.status(204).send()
  }

}

module.exports = CategoryController
