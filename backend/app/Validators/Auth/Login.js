'use strict'

class Login {

  get rules () {
    return {
      email: 'email|required',
      password: 'required|min:4|max:16'
    }
  }

  get messages() {
    return {
      'email.required': 'O endereço de email é obrigatório!',
      'email.email': 'O endereço de email está inválido!',

      'password.required': 'A senha é obrigatória!',
      'password.min': 'A senha deve conter mais que 4 caracteres.',
      'password.max': 'A senha deve conter menos que 16 caracteres.'
    }
  }

}

module.exports = Login