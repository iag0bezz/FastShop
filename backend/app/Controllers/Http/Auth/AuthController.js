'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Role = use('Role')

const Database = use('Database')

class AuthController {

    async loginHandle({ request, response, auth }) {   
        const { email, password } = request.all()

        const [user, data] = await Promise.all([
            auth.withRefreshToken().attempt(email, password),
            User.findBy('email', email)
        ])

        response.cookie('_token', data.token, { httpOnly: true, path: '/' })
        response.cookie('_refreshToken', data.refreshToken, { httpOnly: true, path: '/' })

        return response.status(200).send({
            message: 'Autenticado com sucesso.',
            user
        })
    }

    async registerHandle({ request, response, auth }) {
        const { name, email, password } = request.all()

        const [user, role] = await Promise.all([
            User.create({
                name,
                email,
                password
            }),
            Role.findBy('slug', 'admin')
        ])

        await user.roles().attach([role.id], null)

        const data = await auth.withRefreshToken().attempt(email, password)

        response.cookie('_token', data.token, { httpOnly: true, path: '/' })
        response.cookie('_refreshToken', data.refreshToken, { httpOnly: true, path: '/' })

        return response.status(200).send({
            message: 'Registrado com sucesso!',
            user
        })
    }

    async logoutHandle({ request, response, auth }) {
        let refreshToken = request.input('refreshToken')

        if(!refreshToken){
            refreshToken = request.header('refreshToken')
        }

        await auth.authenticator('jwt').revokeTokens([refreshToken], true)

        response.clearCookie('_token', { httpOnly: true, path: '/' })
        response.clearCookie('_refreshToken', { httpOnly: true, path: '/' })

        return response.status(204).send({})
    }

    async checkHandle({ response }) {
        return response.status(204).send({})
    }

}

module.exports = AuthController
