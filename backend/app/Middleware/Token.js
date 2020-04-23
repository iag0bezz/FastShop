'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Token {

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request }, next) {
    const token = request.cookie('_token')
    const refresh_token = request.cookie('_refreshToken')

    if(token){
      request.request.headers['authorization'] = `bearer ${token}`
    }

    if(refresh_token){
      request.request.headers['refreshToken'] = refresh_token
    }

    await next()
  }

}

module.exports = Token
