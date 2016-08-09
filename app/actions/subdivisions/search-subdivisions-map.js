// actions/subdivisions/search-subdivisions-map.js
import AppStore from '../../stores/AppStore'
import Subdivision from '../../models/Subdivision'
export default q => {
  const params = {
    q
  }
  Subdivision.search(params, (err, res) => {
    if (res.status === 'success') {
      AppStore.data.listing_map.subdivisions = res.data
      AppStore.emitChange()
    }
  })
}