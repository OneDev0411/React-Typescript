// actions/listings/get-valerts-widget.js
import Listing from '../../models/Listing'
import getBrand from '../../models/brand'
import AppStore from '../../stores/AppStore'
import _ from 'lodash'
import async from 'async'
import { getParameterByName } from '../../utils/helpers'
export default (user, options) => {
  const params = {
    options
  }
  if (user) {
    params.access_token = user.access_token
  }
  if (AppStore.data.brand) {
    const brokerage = getParameterByName('brokerage')
    if (brokerage) {
      params.office = brokerage
      params.options.list_offices = [brokerage]
    }
    // delete params.options.list_offices
  }
  async.series([
    async callback => {
      if (!AppStore.data.brand) {
        const hostname = window.location.hostname

        brand = await getBrand(hostname)
        if (brand) {
          AppStore.data.brand = brand
          params.brand = brand.id
          AppStore.emitChange()
          callback()
        }
      } else {
        callback()
      }
    },
    () => {
      Listing.getValerts(params, (err, response) => {
        // Success
        if (response.status === 'success') {
          if (!AppStore.data.widget) {
            AppStore.data.widget = {}
          }
          if (!AppStore.data.widget[response.options.type]) {
            AppStore.data.widget[response.options.type] = {}
          }
          AppStore.data.widget[response.options.type].options = response.options
          if (AppStore.data.location.query.all) {
            AppStore.data.widget[response.options.type].listings = response.data
          } else {
            AppStore.data.widget[response.options.type].listings = _.slice(
              response.data,
              0,
              10
            )
          }
          AppStore.data.widget[response.options.type].listings_info =
            response.info
        }
        if (
          (response.options
            ? response.options.listing_statuses[0]
            : options.listing_statuses[0]) === 'Sold'
        ) {
          AppStore.data.widget[response.options.type].listings.sort(
            (a, b) => parseFloat(a.price) - parseFloat(b.price)
          )
          AppStore.data.widget[response.options.type].listings.reverse()
        } else {
          // Active listings with an online agent show up first. (Issue #500)
          const onlines = []
          const offlines = []

          AppStore.data.widget[response.options.type].listings.forEach(l => {
            const agent_user = l.proposed_agent

            if (
              !agent_user ||
              agent_user.agent ||
              agent_user.agent.online_state === 'Offline'
            ) {
              offlines.push(l)
              return
            }

            onlines.push(l)
          })

          AppStore.data.widget[response.options.type].listings = [
            ..._(onlines).shuffle(),
            ..._(offlines).shuffle()
          ]
        }
        // Order actives by price
        if (
          AppStore.data.location.query.order_by &&
          AppStore.data.location.query.order_by === 'price'
        ) {
          AppStore.data.widget[response.options.type].listings.sort(
            (a, b) => parseFloat(a.price) - parseFloat(b.price)
          )
          AppStore.data.widget[response.options.type].listings.reverse()
        }
        delete AppStore.data.widget[response.options.type].is_loading
        delete AppStore.data.widget[response.options.type].is_loading_listings
        AppStore.emitChange()
      })
    }
  ])
}
