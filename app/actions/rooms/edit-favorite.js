// actions/edit-favorite.js
import Room from '../../models/Room'
import async from 'async'
export default (user, mls_number, favorite) => {
  const locals = {}
  async.series([
    (callback) => {
      const params = {
        room: user.personal_room,
        mls_number,
        access_token: user.access_token
      }
      Room.createRec(params, (err, res) => {
        if (res.data[0]) {
          locals.rec_id = res.data[0].id
          callback()
        }
      })
    },
    () => {
      const params = {
        rec_id: locals.rec_id,
        favorite,
        room_id: user.personal_room,
        access_token: user.access_token
      }
      Room.editFavorite(params, () => {
      })
    }
  ])
}