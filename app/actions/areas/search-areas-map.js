// actions/areas/search-areas-map.js
import AppStore from '../../stores/AppStore'
import Area from '../../models/Area'

export default (q, parents) => {
  const params = {
    q,
    parents
  }
  Area.search(params, (err, res) => {
    if (res.status === 'success') {
      delete AppStore.data.listing_map.areas_loading
      AppStore.data.listing_map.areas = res.data
      AppStore.emitChange()
    }
  })
}