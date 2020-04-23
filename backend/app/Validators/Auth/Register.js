'use strict'

class Register {

  get rules () {
    return {
      email: 'email|required|unique:users,email',
      name: 'required|min:3',
      password: 'required|min:4|max:24'
    }
  }

  get messages() {
    return {
      'email.required': 'O endereço de email é obrigatório!',
      'email.email': 'O endereço de email está inválido!',
      'email.unique': 'O endereço de email já está sendo utilizado!',

      'name.required': 'O nome é obrigatório!',
      'name.min': 'O nome é necessário ter no mínimo 4 caracteres.',

      'password.required': 'A senha é obrigatória!',
      'password.min': 'A senha deve conter mais que 4 caracteres.',
      'password.max': 'A senha deve conter menos que 16 caracteres.'
    }
  }

}

module.exports = Register