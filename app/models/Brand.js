// models/Brand.js
import Fetch from '../services/fetch'

export default {
  getByHostname: (params, callback) => {
<<<<<<< HEAD
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
||||||| merged common ancestors
    let endpoint = `/api/brands/search?hostname=${params.hostname}`
    if (params.user) endpoint += `&access_token=${params.user.access_token}`
=======
    const { hostname, user } = params

    let hn = typeof window !== 'undefined' ? window.location.hostname : null

    if (hostname === hn)
      return false

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
>>>>>>> reimplement Brand model

<<<<<<< HEAD
      return callback(false, res)
    })
||||||| merged common ancestors
    fetch(endpoint)
      .then(response => {
        if (response.status >= 400) {
          const error = {
            status: 'error',
            response
          }
          return callback(error, false)
        }
        return response.json()
      })
      .then(response => callback(false, response))
=======
      return callback(false, res)
    })
    // console.log('>>>', endpoint)
    // fetch(endpoint)
    //   .then(response => {
    //     if (response.status >= 400) {
    //       const error = {
    //         status: 'error',
    //         response
    //       }
    //       return callback(error, false)
    //     }
    //     return response.json()
    //   })
    //   .then(response => callback(false, response))
>>>>>>> reimplement Brand model
  }
}
