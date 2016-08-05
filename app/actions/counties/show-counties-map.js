// actions/counties/show-counties-map.js
import AppStore from '../../stores/AppStore'
import County from '../../models/County'

export default (q) => {
  const params = {
    q
  }
  County.search(params, (err, res) => {
    if (res.status === 'success') {
      delete AppStore.data.listing_map.counties_loading
      AppStore.data.listing_map.counties = res.data.filter(county => {
        return county && county.title !== ''
      })
      AppStore.emitChange()
    }
  })
}