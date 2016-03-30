// controller/listing-panel.js
import listing_util from '../../../../utils/listing'
import _ from 'lodash'
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
import AppStore from '../../../../stores/AppStore'
const controller = {
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
    if (minimum_price)
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
      }
      if (filter_options.status_options.active && filter_options.status_options.active.length)
        listing_statuses = [...listing_statuses, ...filter_options.status_options.active]
      if (filter_options.status_options.other && filter_options.status_options.other.length)
        listing_statuses = [...listing_statuses, ...filter_options.status_options.other]
      options.listing_statuses = listing_statuses
      // Bed / bath
      options.minimum_bedrooms = default_options.minimum_bedrooms
      options.minimum_bathrooms = default_options.minimum_bathrooms
      const minimum_bedrooms = filter_options.minimum_bedrooms
      if (minimum_bedrooms)
        options.minimum_bedrooms = minimum_bedrooms
      const minimum_bathrooms = filter_options.minimum_bathrooms
      if (minimum_bathrooms)
        options.minimum_bathrooms = minimum_bathrooms
      // Pool
      const pool = filter_options.pool
      if (pool === 'either')
        delete options.pool
      else
        options.pool = pool
      // Property types
      if (filter_options.listing_types) {
        let property_subtypes = []
        if (filter_options.listing_types.includes('house'))
          property_subtypes.push('RES-Single Family')
        if (filter_options.listing_types.includes('condo'))
          property_subtypes.push('RES-Condo')
        if (filter_options.listing_types.includes('townhouse'))
          property_subtypes.push('RES-Townhouse')
        if (filter_options.listing_types.includes('any'))
          property_subtypes = ['RES-Single Family', 'RES-Half Duplex', 'RES-Farm\/Ranch', 'RES-Condo', 'RES-Townhouse']
        options.property_subtypes = property_subtypes
      }
      // Year built
      if (filter_options.minimum_year_built)
        options.minimum_year_built = Number(filter_options.minimum_year_built)
      if (filter_options.maximum_year_built)
        options.maximum_year_built = Number(filter_options.maximum_year_built)
    }
    AppStore.data.listing_map.is_loading = true
    AppStore.emitChange()
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
      if (key === 'sold')
        AppStore.data.listing_map.filter_options.status_options[key] = [3]
      if (key === 'active')
        AppStore.data.listing_map.filter_options.status_options[key] = ['Active', 'Active Contingent', 'Active Kick Out', 'Active Option Contract']
      if (key === 'other')
        AppStore.data.listing_map.filter_options.status_options[key] = ['Cancelled', 'Expired', 'Pending', 'Temp Off Market', 'Withdrawn', 'Withdrawn Sublisting']
    } else {
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
      if (value === 'any') {
        if (listing_types.indexOf(value) === -1)
          listing_types = ['any', 'house', 'condo', 'townhouse']
        else
          listing_types = []
      } else {
        if (listing_types.indexOf(value) !== -1)
          _.pull(listing_types, value)
        else
          listing_types.push(value)
        _.pull(listing_types, 'any')
        if (listing_types.length === 3)
          listing_types.push('any')
      }
      AppStore.data.listing_map.filter_options.listing_types = listing_types
    }
    if (key === 'minimum_bedrooms' || key === 'minimum_bathrooms')
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
      maximum_price: 5000000,
      active: true,
      listing_types: ['house']
    }
    AppStore.emitChange()
    ListingDispatcher.dispatch({
      action: 'get-valerts',
      user,
      default_options
    })
  },
  handleOptionChange(key, value) {
    if (!AppStore.data.listing_map.filter_options)
      AppStore.data.listing_map.filter_options = {}
    AppStore.data.listing_map.filter_options[key] = value
    AppStore.emitChange()
  },
  toggleListingStatusDropdown(key) {
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
        AppStore.data.listing_map.filter_options.status_options[key] = [value]
        AppStore.data.listing_map.filter_options.sold = true
      }
      if (key === 'active') {
        AppStore.data.listing_map.filter_options.active = true
      }
      if (key === 'other') {
        AppStore.data.listing_map.filter_options.other = true
      }
    } else {
      AppStore.data.listing_map.filter_options.status_options[key] = options.filter(new_option => {
        return new_option !== value
      })
    }
    AppStore.emitChange()
  }
}
export default controller