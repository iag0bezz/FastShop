'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class OrderPayment extends Model {

    order() {
        return this.belongsTo('App/Models/Order')
    }

}

module.exports = OrderPayment
