'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Product = use('App/Models/Product')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Order = use('App/Models/Order')

const PayPal = use('App/Gateways/paypal')

/** @typedef {import('@adonisjs/framework/src/Env')} Env */
const Env = use('Env')

class OrderService { 

    constructor(model) {
        this.model = model
    }

    async fetchItems(items){
        const products = await this.getProducts(items)
        await this.model.items().createMany(products)
    }

    async fetchPayment(items) {
        const order = await Order.find(this.model.id)
        const transactionItems = await this.getPaymentProducts(items)

        const paymentDetails = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal'
            },
            redirect_urls: {
                return_url: Env.get('PAYPAL_RETURN'),
                cancel_url: Env.get('PAYPAL_CANCEL')
            },
            transactions: [
                {
                    amount: {
                        total: `${order.total}`,
                        currency: 'BRL'
                    },
                    description: 'Apenas uma descrição de pagamento.',
                    item_list: {
                        items: transactionItems
                    }
                }
            ]
        }
        return new Promise( (resolve, reject) => {
            PayPal.payment.create(paymentDetails, (err, payment) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(payment)
                }
            })
        })
    }

    async getProducts(items){
        const orderItems = []
        await Promise.all(
            items.map(async item => {
                const product = await Product.find(item.product_id)
                if(product != null){
                     orderItems.push({
                        order_id: this.model.id,
                        product_id: product.id,
                        subtotal: (product.price * item.quantity),
                        quantity: item.quantity
                    })
                }
            })
        )
        return orderItems
    }

    async getPaymentProducts(items) {
        const paymentItems = []
        await Promise.all(
            items.map(async item => {
                const product = await Product.find(item.product_id)
                if(product != null){
                    paymentItems.push({
                        name: product.name,
                        sku: `${product.id}`,
                        price: `${product.price}`,
                        quantity: item.quantity,
                        currency: 'BRL'
                    })
                }
            })
        )
        return paymentItems
    }

}

module.exports = OrderService