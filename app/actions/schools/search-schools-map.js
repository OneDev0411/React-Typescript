// actions/schools/search-schools-map.js
import AppStore from '../../stores/AppStore'
import School from '../../models/School'
import _ from 'lodash'
export default (district) => {
  const params = {
    district
  }
  School.search(params, (err, res) => {
    if (res.status === 'success') {
      delete AppStore.data.listing_map.schools_loading
      if (!AppStore.data.listing_map.schools)
        AppStore.data.listing_map.schools = res.data
      else
        AppStore.data.listing_map.schools.push(...res.data)
      AppStore.data.listing_map.schools = _.uniqBy(AppStore.data.listing_map.schools, 'name')
      AppStore.data.listing_map.elementary_schools = _.filter(AppStore.data.listing_map.schools, { school_type: 'elementary_school' })
      AppStore.data.listing_map.middle_schools = _.find(AppStore.data.listing_map.schools, { school_type: 'middle_school' })
      AppStore.emitChange()
    }
  })
}