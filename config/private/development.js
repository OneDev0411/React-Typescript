// config/development.js
export default {
  app_url: 'http://localhost:3000',
  api: {
    url: 'http://alpine.d.rechat.co',
    client_id: 'bf0da47e-7226-11e4-905b-0024d71b10fc',
    client_secret: 'secret'
  },
  crypto: {
    key: 'QT1VTj3TrAkVCYE7fwY1vrbZurJfbaOo',
    iv: '4231313091420373'
  },
  test: {
    api_host: 'http://localhost:3000',
    user: {
      email: 'tony@rechat.co',
      password: 'asdfasdf'
    },
    addUser: {
      id: '2678bdaa-a42c-11e5-8bb2-0242ac110006'
    },
    mls_number: 13146601
  }
}