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
      AppStore.data.listing_map.middle_schools = _.filter(AppStore.data.listing_map.schools, { school_type: 'middle_school' })
      AppStore.data.listing_map.junior_high_schools = _.filter(AppStore.data.listing_map.schools, { school_type: 'junior_high_school' })
      AppStore.data.listing_map.senior_high_schools = _.filter(AppStore.data.listing_map.schools, { school_type: 'senior_high_school' })
      AppStore.data.listing_map.intermediate_schools = _.filter(AppStore.data.listing_map.schools, { school_type: 'intermediate_school' })
      AppStore.emitChange()
    }
  })
}