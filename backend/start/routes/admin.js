/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {

    Route.resource('images', 'ImageController').apiOnly()

    Route.resource('categories', 'CategoryController').apiOnly()

    Route.resource('products', 'ProductController').apiOnly()

    Route.resource('orders', 'OrderController').apiOnly()

})
.prefix('v1/admin')
.namespace('Admin')
.middleware(['auth', 'is:( admin )'])