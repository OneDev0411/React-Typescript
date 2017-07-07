// models/Brand.js
import Fetch from '../services/fetch'

export default {
  getByHostname: (params, callback) => {
    const { hostname, user } = params

   let endpoint = `/brands/search?hostname=${hostname}`
   if (params.user) endpoint += `&access_token=${user.access_token}`

   new Fetch()
    .get(endpoint)
    .end((err, res) => {
      if (err) {
        return callback(err, false)
      }

     res.status = 'success'
      res.data = res.body.data
      res.info = res.body.info

     return callback(false, res)
    })
  }
}
