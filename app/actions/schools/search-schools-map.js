// actions/schools/search-schools-map.js
import AppStore from '../../stores/AppStore'
import School from '../../models/School'

export default (q) => {
  const params = {
    q
  }
  School.search(params, (err, res) => {
    if (res.status === 'success') {
      AppStore.data.listing_map.schools = res.data
      AppStore.emitChange()
    }
  })
}