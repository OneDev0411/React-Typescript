// actions/edit-favorite.js
import Room from '../../models/Room'
import AppStore from '../../stores/AppStore'
import async from 'async'
export default (user, listing, favorite) => {
  const locals = {}
  async.series([
    callback => {
      const params = {
        rooms: [user.personal_room],
        mls_number: listing.mls_number,
        access_token: user.access_token
      }
      Room.createRec(params, (err, res) => {
        locals.rec_id = res.data[0].id
        callback()
      })
    },
    () => {
      const params = {
        rec_id: locals.rec_id,
        favorite,
        room_id: user.personal_room,
        access_token: user.access_token
      }
      Room.editFavorite(params, (err, response) => {
        // Success
        if (response.status === 'success') {
          if (!AppStore.data.user.favorite_listings)
            AppStore.data.user.favorite_listings = []
          if (favorite)
            AppStore.data.user.favorite_listings.push(listing)
          else {
            AppStore.data.user.favorite_listings = AppStore.data.user.favorite_listings.filter(listing_loop => {
              if (listing_loop.id !== listing.id)
                return listing_loop
            })
          }
        }
        AppStore.emitChange()
      })
    }
  ])
}