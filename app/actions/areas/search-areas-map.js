// actions/areas/search-areas-map.js
import AppStore from '../../stores/AppStore'
import Area from '../../models/Area'

export default (parents, q) => {
  const params = {
    q,
    parents
  }
  Area.search(params, (err, res) => {
    if (res.status === 'success') {
      delete AppStore.data.listing_map.areas_loading
      if (!parents) {
        AppStore.data.listing_map.areas = res.data
        AppStore.emitChange()
        return
      }
      AppStore.data.listing_map.sub_areas = res.data
      AppStore.emitChange()
    }
  })
}