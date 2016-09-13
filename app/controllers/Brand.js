// Brand.js
import AppDispatcher from '../dispatcher/AppDispatcher'
import AppStore from '../stores/AppStore'

class Brand {
  constructor() {
    this.checkBranding()
  }

  color(name, def) {
    const brand = AppStore.data.brand
    if (!brand)
      return def

    const palette = brand.palette

    if (palette[name])
      return palette[name].replace('#', '')

    return def
  }

  asset(name, def) {
    const brand = AppStore.data.brand
    if (!brand)
      return def

    const assets = brand.assets
    if (assets[name])
      return assets[name]

    return def
  }

  message(name, def) {
    const brand = AppStore.data.brand
    if (!brand)
      return def

    const messages = brand.messages
    if (messages[name])
      return messages[name]

    return def
  }

  side(listing) {
    const brand = AppStore.data.brand
    const agent_ids = brand.agents ? brand.agents.map(a => a.id) : []

    const is_list_agent = agent_ids.indexOf(listing.list_agent.id) > -1
    const is_selling_agent = agent_ids.indexOf(listing.selling_agent) > -1

    if (is_list_agentis_selling_agent)
      return 'Listing & Buyer Agent'

    if ((is_list_office || is_list_agent) && !(is_selling_office || is_selling_agent))
      return 'Listing Agent'

    if (!(is_list_office || is_list_agent) && (is_selling_office || is_selling_agent))
      return 'Buyer Agent'

    return ''
  }

  checkBranding() {
    if (typeof window === 'undefined')
      return

    const hostname = window.location.hostname
    AppDispatcher.dispatch({
      action: 'get-branding',
      hostname
    })
  }
}

const b = new Brand()

export default b