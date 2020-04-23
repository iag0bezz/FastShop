/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {

    Route.resource('orders', 'OrderController').apiOnly().middleware(['auth'])

})
.prefix('v1/client')
.namespace('Client')