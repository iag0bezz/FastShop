'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {

  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle (error, { request, response }) {
    switch(error.name) {
      case 'ValidationException': {
        return response.status(error.status).send({
          errors: error.messages
        })
      }
      case 'UserNotFoundException': {
        return response.status(error.status).send({
          error: 'Nenhum usuário foi encontrado com essas informações.'
        })
      }
      case 'ModelNotFoundException': {
        return response.status(error.status).send({
          errror: 'Não foi possível encontrar este item.'
        })
      }
      case 'InvalidJwtToken': {
        return response.status(error.status).send({
          error: 'Nenhum token foi informado.'
        })
      }
      case 'PasswordMisMatchException': {
        return response.status(error.status).send({
          error: 'Endereço de e-mail ou senha inválido!'
        })
      }
      case 'HttpException': {
        return response.status(error.status).send({
          error: 'Você não tem permissão para acessar esta página.'
        })
      }
      case 'ForbiddenException': {
        return response.status(error.status).send({
          error: 'Você não tem permissão para acessar esta página.'
        })
      }
      default: {
        return response.status(error.status).send(error.message)
      }
    }
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report (error, { request }) { 
  }

}

module.exports = ExceptionHandler
