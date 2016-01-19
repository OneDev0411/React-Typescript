// models/iCloud.js
import icloud from 'icloud'
const instance = icloud()

export default {

  getContacts: (params, callback) => {
    
    instance.login(params.username, params.password, (err) => {
      if (err) return console.log('login failed')
      instance.contacts((err, results) => {
        if (err) return console.log('failed to fetch contacts')
        console.log(results.contacts)
      })
    })
  }
}