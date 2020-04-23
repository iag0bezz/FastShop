/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {

    Route.post('login', 'AuthController.loginHandle')
        .as('auth.login')
        .middleware(['guest'])
        .validator('Auth/Login')

    Route.post('register', 'AuthController.registerHandle')
        .as('auth.register')
        .middleware(['guest'])
        .validator('Auth/Register')

    Route.post('logout', 'AuthController.logoutHandle')
        .as('auth.logout')
        .middleware(['auth'])

    Route.get('check', 'AuthController.checkHandle')
        .as('auth.check')
        .middleware(['auth'])

})
.prefix('v1/auth')
.namespace('Auth')