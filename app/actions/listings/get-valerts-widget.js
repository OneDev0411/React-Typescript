// actions/listings/get-valerts-widget.js
import Listing from '../../models/Listing'
import Brand from '../../models/Brand'
import AppStore from '../../stores/AppStore'
import _ from 'lodash'
import async from 'async'
import { getParameterByName } from '../../utils/helpers'
export default (user, options) => {
  const params = {
    options
  }
  if (user)
    params.access_token = user.access_token
  if (AppStore.data.brand) {
    const brokerage = getParameterByName('brokerage')
    if (brokerage) {
      params.office = brokerage
      params.options.list_offices = [brokerage]
    }
    // delete params.options.list_offices
  }
  async.series([
    (callback) => {
      if (!AppStore.data.brand) {
        const hostname = window.location.hostname

        Brand.getByHostname({ hostname }, (err, res) => {
          AppStore.data.brand = res.data
          AppStore.emitChange()
          callback()
        })
      } else
        callback()
    },
    () => {
      Listing.getValerts(params, (err, response) => {
        // Success
        if (response.status === 'success') {
          if (!AppStore.data.widget)
            AppStore.data.widget = {}
          if (AppStore.data.location.query.all)
            AppStore.data.widget.listings = response.data
          else
            AppStore.data.widget.listings = _.slice(response.data, 0, 10)
          AppStore.data.widget.listings_info = response.info
        }
        if (options.listing_statuses[0] === 'Sold') {
          AppStore.data.widget.listings.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
          AppStore.data.widget.listings.reverse()
        } else {
          // Active listings with an online agent show up first. (Issue #500)
          const onlines = []
          const offlines = []

          AppStore.data.widget.listings.forEach((l) => {
            const agent = l.list_agent

            if (!agent || agent.online_state === 'Offline') {
              offlines.push(l)
              return
            }

            onlines.push(l)
          })

          AppStore.data.widget.listings = [
            ..._(onlines).shuffle(),
            ..._(offlines).shuffle()
          ]
        }
        // Order actives by price
        if (AppStore.data.location.query.order_by && AppStore.data.location.query.order_by === 'price') {
          AppStore.data.widget.listings.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
          AppStore.data.widget.listings.reverse()
        }
        delete AppStore.data.widget.is_loading
        delete AppStore.data.widget.is_loading_listings
        AppStore.emitChange()
      })
    }
  ])
}