// actions/schools/search-schools-map.js
import AppStore from '../../stores/AppStore'
import School from '../../models/School'
import _ from 'lodash'
import async from 'async'
export default (districts) => {
  AppStore.data.listing_map.schools = []
  async.eachSeries(districts, (district, callback) => {
    const params = {
      district
    }
    School.search(params, (err, res) => {
      if (res.status === 'success') {
        delete AppStore.data.listing_map.schools_loading
        AppStore.data.listing_map.schools.push(...res.data)
        AppStore.emitChange()
      }
      callback()
    })
  }, () => {
    AppStore.data.listing_map.schools.forEach((school) => {
      school.appearances = Number(school.appearances)
    })
    AppStore.data.listing_map.elementary_schools = _.orderBy(_.uniqBy(_.filter(AppStore.data.listing_map.schools, { school_type: 'elementary_school' }), 'name'), ['appearances'], ['desc'])
    AppStore.data.listing_map.middle_schools = _.orderBy(_.uniqBy(_.filter(AppStore.data.listing_map.schools, { school_type: 'middle_school' }), 'name'), ['appearances'], ['desc'])
    AppStore.data.listing_map.high_schools = _.orderBy(_.uniqBy(_.filter(AppStore.data.listing_map.schools, s => s.school_type === 'senior_high_school' || s.school_type === 'junior_high_school'), 'name'), ['appearances'], ['desc'])
    AppStore.data.listing_map.intermediate_schools = _.orderBy(_.uniqBy(_.filter(AppStore.data.listing_map.schools, { school_type: 'intermediate_school' }), 'name'), ['appearances'], ['desc'])
    AppStore.emitChange()
  })
}