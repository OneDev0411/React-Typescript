// controller/listing-panel.js
import listing_util from '../../../../utils/listing'
import _ from 'lodash'
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
import AppStore from '../../../../stores/AppStore'
import search_input_controller from './search-input-map'
const controller = {
  hideFilterForm() {
    setTimeout(() => {
      search_input_controller.initGoogleSearch()
    }, 300)
    delete AppStore.data.show_filter_form
    AppStore.emitChange()
  },
  getSoldDate(minimum_sold_value) {
    const date = new Date()
    return (date.setMonth(date.getMonth() - minimum_sold_value)) / 1000
  },
  setFilterOptions(e) {
    e.preventDefault()
    const data = AppStore.data
    const user = data.user
    const listing_map = data.listing_map
    /* Options
    ==================== */
    const options = listing_map.options
    const default_options = listing_map.default_options

    // Price
    // defaults
    options.minimum_price = default_options.minimum_price
    options.maximum_price = default_options.maximum_price
    const minimum_price = Number(this.refs.minimum_price.refs.input.value.trim())
    options.minimum_price = minimum_price
    const maximum_price = Number(this.refs.maximum_price.refs.input.value.trim())
    if (maximum_price)
      options.maximum_price = maximum_price

    // Size
    // defaults
    options.minimum_square_meters = 0
    options.maximum_square_meters = default_options.maximum_square_meters
    const minimum_square_feet = Number(this.refs.minimum_square_feet.refs.input.value.trim())
    if (minimum_square_feet)
      options.minimum_square_meters = listing_util.feetToMeters(minimum_square_feet)
    const maximum_square_feet = Number(this.refs.maximum_square_feet.refs.input.value.trim())
    if (maximum_square_feet)
      options.maximum_square_meters = listing_util.feetToMeters(maximum_square_feet)
    // Lot
    options.minimum_lot_square_meters = 0
    options.maximum_lot_square_meters = default_options.maximum_lot_square_meters
    const minimum_lot_square_feet = Number(this.refs.minimum_lot_square_feet.refs.input.value.trim())
    if (minimum_lot_square_feet)
      options.minimum_lot_square_meters = listing_util.feetToMeters(minimum_lot_square_feet)
    const maximum_lot_square_feet = Number(this.refs.maximum_lot_square_feet.refs.input.value.trim())
    if (maximum_lot_square_feet)
      options.maximum_lot_square_meters = listing_util.feetToMeters(maximum_lot_square_feet)

    // Get filter options
    if (listing_map.filter_options) {
      const filter_options = listing_map.filter_options
      // Status
      // Active,Sold,Pending,"Temp Off Market",Leased,"Active Option Contract","Active Contingent","Active Kick Out",Withdrawn,Expired,Cancelled,"Withdrawn Sublisting",Incomplete,Unknown,"Out Of Sync",Incoming
      delete options.minimum_sold_date
      let listing_statuses = []
      if (filter_options.sold) {
        listing_statuses.push('Sold')
        const minimum_sold_value = filter_options.status_options.sold
        options.minimum_sold_date = controller.getSoldDate(minimum_sold_value)
        if (filter_options.sold_date)
          options.minimum_sold_date = filter_options.sold_date
      }
      if (filter_options.status_options && filter_options.status_options.active && filter_options.status_options.active.length)
        listing_statuses = [...listing_statuses, ...filter_options.status_options.active]
      if (filter_options.status_options && filter_options.status_options.other && filter_options.status_options.other.length)
        listing_statuses = [...listing_statuses, ...filter_options.status_options.other]
      options.listing_statuses = listing_statuses
      // Open houses
      options.open_house = listing_map.filter_options.open_house
      if (!options.open_house)
        options.open_house = false
      // Bed / bath
      options.minimum_bedrooms = default_options.minimum_bedrooms
      options.minimum_bathrooms = default_options.minimum_bathrooms
      const minimum_bedrooms = filter_options.minimum_bedrooms
      if (minimum_bedrooms)
        options.minimum_bedrooms = minimum_bedrooms
      const minimum_bathrooms = filter_options.minimum_bathrooms
      if (minimum_bathrooms)
        options.minimum_bathrooms = minimum_bathrooms
      // Garage
      options.minimum_parking_spaces = filter_options.minimum_parking_spaces
      // Pool
      const pool = filter_options.pool
      if (pool === 'either')
        delete options.pool
      else
        options.pool = pool
      // Property types
      if (filter_options.listing_types) {
        let property_subtypes = []
        if (filter_options.listing_types.indexOf('house') !== -1)
          property_subtypes.push('RES-Single Family')
        if (filter_options.listing_types.indexOf('condo') !== -1)
          property_subtypes.push('RES-Condo')
        if (filter_options.listing_types.indexOf('townhouse') !== -1)
          property_subtypes.push('RES-Townhouse')
        if (filter_options.listing_types.indexOf('any') !== -1)
          property_subtypes = ['RES-Single Family', 'RES-Half Duplex', 'RES-Farm\/Ranch', 'RES-Condo', 'RES-Townhouse']
        options.property_subtypes = property_subtypes
      }
      // Year built
      if (filter_options.minimum_year_built)
        options.minimum_year_built = Number(filter_options.minimum_year_built)
      if (filter_options.maximum_year_built)
        options.maximum_year_built = Number(filter_options.maximum_year_built)
    }
    // Listings statues not selected
    if (!options.listing_statuses.length) {
      AppStore.data.show_filter_error_modal = true
      AppStore.emitChange()
      return
    }
    // Add additional filters
    // Areas
    delete options.mls_areas
    if (AppStore.data.listing_map.areas_selected) {
      options.mls_areas = []
      AppStore.data.listing_map.areas_selected.forEach(area => {
        options.mls_areas.push(
          [area.value, 0]
        )
      })
      // Sub Areas
      if (AppStore.data.listing_map.sub_areas_selected) {
        AppStore.data.listing_map.sub_areas_selected.forEach(sub_area => {
          options.mls_areas.push([sub_area.value, sub_area.parent])
        })
      }
      // Filter out major areas
      options.mls_areas = options.mls_areas.filter(area => {
        if (AppStore.data.listing_map.sub_areas_selected && !area[1])
          return false
        return true
      })
    }
    // Counties
    delete options.counties
    if (AppStore.data.listing_map.counties_selected) {
      options.counties = []
      AppStore.data.listing_map.counties_selected.forEach(county => {
        options.counties.push(county.value)
      })
    }
    // School Districts
    delete options.school_districts
    delete options.elementary_schools
    delete options.middle_schools
    delete options.junior_high_schools
    delete options.senior_high_schools
    delete options.intermediate_schools
    if (AppStore.data.listing_map.school_districts_selected) {
      options.school_districts = []
      AppStore.data.listing_map.school_districts_selected.forEach(school_district => {
        options.school_districts.push(school_district.value)
      })
      // Schools
      if (AppStore.data.listing_map.elementary_schools_selected && AppStore.data.listing_map.elementary_schools_selected.length) {
        options.elementary_schools = []
        AppStore.data.listing_map.elementary_schools_selected.forEach(elementary_school => {
          options.elementary_schools.push(elementary_school.value)
        })
      }
      if (AppStore.data.listing_map.middle_schools_selected && AppStore.data.listing_map.middle_schools_selected.length) {
        options.middle_schools = []
        AppStore.data.listing_map.middle_schools_selected.forEach(middle_school => {
          options.middle_schools.push(middle_school.value)
        })
      }
      if (AppStore.data.listing_map.junior_high_schools_selected && AppStore.data.listing_map.junior_high_schools_selected.length) {
        options.junior_high_schools = []
        AppStore.data.listing_map.junior_high_schools_selected.forEach(junior_high_school => {
          options.junior_high_schools.push(junior_high_school.value)
        })
      }
      if (AppStore.data.listing_map.senior_high_schools_selected && AppStore.data.listing_map.senior_high_schools_selected.length) {
        options.senior_high_schools = []
        AppStore.data.listing_map.senior_high_schools_selected.forEach(senior_high_school => {
          options.senior_high_schools.push(senior_high_school.value)
        })
      }
      if (AppStore.data.listing_map.intermediate_schools_selected && AppStore.data.listing_map.intermediate_schools_selected.length) {
        options.intermediate_schools = []
        AppStore.data.listing_map.intermediate_schools_selected.forEach(intermediate_school => {
          options.intermediate_schools.push(intermediate_school.value)
        })
      }
    }
    // Home Styles
    delete options.architectural_styles
    if (AppStore.data.listing_map.home_styles_selected) {
      options.architectural_styles = []
      AppStore.data.listing_map.home_styles_selected.forEach(home_styles_selected => {
        options.architectural_styles.push(home_styles_selected.value)
      })
    }
    // Home Styles
    delete options.subdivisions
    if (AppStore.data.listing_map.subdivisions_selected) {
      options.subdivisions = []
      AppStore.data.listing_map.subdivisions_selected.forEach(subdivision => {
        options.subdivisions.push(subdivision.value)
      })
    }
    AppStore.data.listing_map.is_loading = true
    AppStore.emitChange()
    if (options.mls_areas || options.counties) {
      options.points = null
      ListingDispatcher.dispatch({
        action: 'get-valerts-no-geo',
        user,
        options
      })
      return
    }
    ListingDispatcher.dispatch({
      action: 'get-valerts',
      user,
      options
    })
  },
  showFilterForm() {
    delete AppStore.data.listing_panel
    delete AppStore.data.show_listing_panel
    if (AppStore.data.show_filter_form)
      delete AppStore.data.show_filter_form
    else
      AppStore.data.show_filter_form = true
    AppStore.emitChange()
  },
  handleFilterSwitch(key) {
    if (!AppStore.data.listing_map.filter_options)
      AppStore.data.listing_map.filter_options = {}
    if (!AppStore.data.listing_map.filter_options[key]) {
      AppStore.data.listing_map.filter_options[key] = true
      if (!AppStore.data.listing_map.filter_options.status_options)
        AppStore.data.listing_map.filter_options.status_options = {}
      if (key === 'sold')
        AppStore.data.listing_map.filter_options.status_options[key] = [3]
      if (key === 'active')
        AppStore.data.listing_map.filter_options.status_options[key] = ['Active', 'Active Contingent', 'Active Kick Out', 'Active Option Contract']
      if (key === 'other')
        AppStore.data.listing_map.filter_options.status_options[key] = ['Cancelled', 'Expired', 'Pending', 'Temp Off Market', 'Withdrawn', 'Withdrawn Sublisting']
      if (key === 'open_house') {
        delete AppStore.data.listing_map.filter_options.sold
        delete AppStore.data.listing_map.filter_options.other
        AppStore.data.listing_map.filter_options[key] = true
        AppStore.data.listing_map.filter_options.active = true
        AppStore.data.listing_map.filter_options.status_options.active = ['Active', 'Active Contingent', 'Active Kick Out', 'Active Option Contract']
      }
    } else {
      if (key === 'sold') {
        delete AppStore.data.listing_map.filter_options.show_sold_date_picker
        delete AppStore.data.listing_map.filter_options.sold_date
      }
      delete AppStore.data.listing_map.filter_options[key]
      AppStore.data.listing_map.filter_options.status_options[key] = []
    }
    AppStore.emitChange()
  },
  handleFilterButton(payload) {
    const key = payload.key
    const value = payload.value
    const filter_options = AppStore.data.listing_map.filter_options
    if (!filter_options)
      AppStore.data.listing_map.filter_options = {}
    if (key === 'listing_types') {
      let listing_types = []
      if (filter_options && filter_options.listing_types)
        listing_types = filter_options.listing_types
      // If has already, remove
      if (listing_types.indexOf(value) !== -1)
        _.pull(listing_types, value)
      else
        listing_types.push(value)
      if (value !== 'any')
        _.pull(listing_types, 'any')
      if (value === 'any')
        listing_types = ['any']
      AppStore.data.listing_map.filter_options.listing_types = listing_types
    }
    if (key === 'minimum_bedrooms' || key === 'minimum_bathrooms' || key === 'minimum_parking_spaces')
      AppStore.data.listing_map.filter_options[key] = Number(value)
    if (key === 'pool')
      AppStore.data.listing_map.filter_options[key] = value
    AppStore.emitChange()
  },
  resetFilterOptions() {
    const data = AppStore.data
    const user = data.user
    const listing_map = data.listing_map
    const default_options = listing_map.default_options
    AppStore.data.listing_map.filter_options = {
      active: true,
      listing_types: ['any'],
      status_options: {
        active: ['Active', 'Active Contingent', 'Active Kick Out', 'Active Option Contract']
      },
      minimum_bedrooms: 0,
      minimum_bathrooms: 1,
      pool: 'either',
      open_house: false
    }
    AppStore.emitChange()
    ListingDispatcher.dispatch({
      action: 'get-valerts',
      user,
      options: default_options
    })
  },
  handleOptionChange(key, value) {
    if (!AppStore.data.listing_map.filter_options)
      AppStore.data.listing_map.filter_options = {}
    AppStore.data.listing_map.filter_options[key] = value
    AppStore.emitChange()
  },
  toggleListingStatusDropdown(key) {
    if (!AppStore.data.listing_map.filter_options)
      AppStore.data.listing_map.filter_options = {}
    if (!AppStore.data.listing_map.filter_options.status_dropdowns)
      AppStore.data.listing_map.filter_options.status_dropdowns = {}
    if (key && AppStore.data.listing_map.filter_options.status_dropdowns[key])
      delete AppStore.data.listing_map.filter_options.status_dropdowns[key]
    else
      AppStore.data.listing_map.filter_options.status_dropdowns[key] = true
    AppStore.emitChange()
  },
  handleFilterStatusOptionSelect(key, value) {
    if (!AppStore.data.listing_map.filter_options.status_options)
      AppStore.data.listing_map.filter_options.status_options = {}
    if (!AppStore.data.listing_map.filter_options.status_options[key])
      AppStore.data.listing_map.filter_options.status_options[key] = []
    // Check for already added
    const options = AppStore.data.listing_map.filter_options.status_options[key]
    if (options.indexOf(value) === -1) {
      AppStore.data.listing_map.filter_options.status_options[key].push(value)
      if (key === 'sold') {
        delete AppStore.data.listing_map.filter_options.show_sold_date_picker
        delete AppStore.data.listing_map.filter_options.sold_date
        AppStore.data.listing_map.filter_options.status_options[key] = [value]
        AppStore.data.listing_map.filter_options.sold = true
      }
      if (key === 'active')
        AppStore.data.listing_map.filter_options.active = true
      if (key === 'other')
        AppStore.data.listing_map.filter_options.other = true
    } else {
      AppStore.data.listing_map.filter_options.status_options[key] = options.filter(new_option => {
        return new_option !== value
      })
    }
    AppStore.emitChange()
  },
  showSoldDatePicker() {
    if (AppStore.data.listing_map.filter_options.show_sold_date_picker)
      delete AppStore.data.listing_map.filter_options.show_sold_date_picker
    else
      AppStore.data.listing_map.filter_options.show_sold_date_picker = true
    delete AppStore.data.listing_map.filter_options.status_options.sold
    AppStore.emitChange()
  },
  handleSetSoldDate(day) {
    AppStore.data.listing_map.filter_options.sold_date = (day.getTime() / 1000)
    delete AppStore.data.listing_map.filter_options.show_sold_date_picker
    AppStore.data.listing_map.filter_options.sold = true
    AppStore.emitChange()
  },
  showSchoolDistrictsList(q) {
    AppStore.data.listing_map.school_districts_loading = true
    AppStore.data.listing_map.show_school_districts_list = true
    AppStore.emitChange()
    ListingDispatcher.dispatch({
      action: 'search-school-districts-map',
      q: q ? q : ''
    })
  },
  changeSchoolDistrictsSelected(school_districts_selected) {
    AppStore.data.listing_map.school_districts_selected = school_districts_selected
    AppStore.emitChange()
  },
  showSchoolsList() {
    AppStore.data.listing_map.schools_loading = true
    AppStore.data.listing_map.show_schools_list = true
    const new_districts_selected = AppStore.data.listing_map.school_districts_selected.length
    AppStore.emitChange()
    ListingDispatcher.dispatch({
      action: 'search-schools-map',
      district: AppStore.data.listing_map.school_districts_selected[new_districts_selected - 1].value
    })
  },
  changeSchoolsSelected(school_type, schools_selected) {
    if (school_type === 'elementary_school')
      AppStore.data.listing_map.elementary_schools_selected = schools_selected
    if (school_type === 'middle_school')
      AppStore.data.listing_map.middle_schools_selected = schools_selected
    if (school_type === 'junior_high_school')
      AppStore.data.listing_map.junior_high_schools_selected = schools_selected
    if (school_type === 'senior_high_school')
      AppStore.data.listing_map.senior_high_schools_selected = schools_selected
    if (school_type === 'intermediate_school')
      AppStore.data.listing_map.intermediate_schools_selected = schools_selected
    AppStore.emitChange()
  },
  showAreasList() {
    AppStore.data.listing_map.areas_loading = true
    AppStore.data.listing_map.show_areas_list = true
    AppStore.emitChange()
    ListingDispatcher.dispatch({
      action: 'search-areas-map',
      parents: 0,
      q: ''
    })
  },
  changeAreasSelected(areas_selected) {
    AppStore.data.listing_map.areas_selected = areas_selected
    controller.getSubAreas(areas_selected)
    AppStore.emitChange()
  },
  getSubAreas(areas_selected) {
    if (!areas_selected) {
      delete AppStore.data.listing_map.sub_areas_selected
      AppStore.emitChange()
      return
    }
    const area_numbers = _.map(areas_selected, 'value')
    ListingDispatcher.dispatch({
      action: 'search-areas-map',
      parents: area_numbers.join(','),
      q: ''
    })
  },
  changeSubAreasSelected(sub_areas_selected) {
    AppStore.data.listing_map.sub_areas_selected = sub_areas_selected
    AppStore.emitChange()
  },
  showCountiesList() {
    AppStore.data.listing_map.counties_loading = true
    AppStore.data.listing_map.show_counties_list = true
    AppStore.emitChange()
    ListingDispatcher.dispatch({
      action: 'show-counties-map',
      q: ''
    })
  },
  changeCountiesSelected(counties_selected) {
    AppStore.data.listing_map.counties_selected = counties_selected
    AppStore.emitChange()
  },
  changeHomeStylesSelected(home_styles_selected) {
    AppStore.data.listing_map.home_styles_selected = home_styles_selected
    AppStore.emitChange()
  },
  showSubdivisionsList(value) {
    if (value.length > 2) {
      ListingDispatcher.dispatch({
        action: 'search-subdivisions-map',
        q: value
      })
    }
  },
  changeSubdivisionsSelected(subdivisions_selected) {
    AppStore.data.listing_map.subdivisions_selected = subdivisions_selected
    AppStore.emitChange()
  }
}
export default controller