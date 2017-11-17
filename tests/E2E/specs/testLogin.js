import user from '../data/login'

module.exports = {
  '#41 User can login with valid credentials': client => {
    const page = client.page.login()

    page.navigate()
    page.login(user.email, user.password, false)
    client.end()
  },
  '#42 User can not login with wrong password and correct': client => {
    const page = client.page.login()

    page.navigate()
    page.login(user.email, user.wrongPassword, true)
    client.end()
  },
  '#43 User can not login with wrong email and correct password ': client => {
    const page = client.page.login()

    page.navigate()
    page.login(user.wrongEmail, user.password, true)
    client.end()
  }
}
