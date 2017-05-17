// actions/schools/search-schools-map.js
import AppStore from '../../stores/AppStore'
import School from '../../models/School'

export default (q) => {
  const params = {
    q
  }
  School.searchDistricts(params, (err, res) => {
    if (res.status === 'success') {
      delete AppStore.data.listing_map.school_districts_loading
      AppStore.data.listing_map.school_districts = res.data.filter(school_district => school_district && school_district.district !== '')
      AppStore.emitChange()
    }
  })
}