const signUpData = require('../data/signup.js')

let signUpConstants = signUpData.signUpConstants()

module.exports = {
  '#55 User can not sign up with wrong email without @ sign': client => {
    const signup = client.page.signup()

    signup.navigate()
    signup.signup(signUpConstants.wrongEmail1, true)
    client.end()
  },

  '#56 User can not sign up with wrong email without domain name': client => {
    const signup = client.page.signup()

    signup.navigate()
    signup.signup(signUpConstants.wrongEmail2, true)
    client.end()
  },

  '#57 User can not sign up with wrong email without ending . (dot)': client => {
    const signup = client.page.signup()

    signup.navigate()
    signup.signup(signUpConstants.wrongEmail3, true)
    client.end()
  },

  '#58 User can sign up with correct email': client => {
    const signup = client.page.signup()

    signup.navigate()
    signup.signup(
      `${Math.random()
        .toString(36)
        .substring(7)}@gmail.com`,
      false
    )
    client.end()
  }
}
