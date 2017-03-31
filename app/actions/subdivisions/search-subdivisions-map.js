// actions/subdivisions/search-subdivisions-map.js
import AppStore from '../../stores/AppStore'
import Subdivision from '../../models/Subdivision'
import _ from 'lodash'
export default (q) => {
  const params = {
    q
  }
  Subdivision.search(params, (err, res) => {
    if (res && res.status === 'success') {
      AppStore.data.listing_map.subdivisions = res.data
      AppStore.data.listing_map.subdivisions.forEach((subdivision) => {
        subdivision.appearances = Number(subdivision.appearances)
      })
      AppStore.data.listing_map.subdivisions = _.orderBy(AppStore.data.listing_map.subdivisions, ['appearances'], ['desc'])
      AppStore.emitChange()
    }
  })
}