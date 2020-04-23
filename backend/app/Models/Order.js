'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Order extends Model {

    static boot() {
        super.boot()

        this.addHook('afterFind', 'OrderHook.update')
        this.addHook('afterPaginate', 'OrderHook.updateCollection')
    }

    items() {
        return this.hasMany('App/Models/OrderItem')
    }

    user() {
        return this.belongsTo('App/Models/User')
    }

    payment() {
        return this.hasOne('App/Models/OrderPayment')
    }

}

module.exports = Order