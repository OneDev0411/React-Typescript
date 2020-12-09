import ReactGA from 'react-ga'
import idx from 'idx'

import Brand from '../../controllers/Brand'

export function setupGoogleAnalytics(brand: IBrand) {
  if (!window) {
    return
  }

  const analyticsId = Brand.asset('google_analytics_id', 'UA-56150904-2', brand)

  const hostname = idx(brand, b => b.hostnames[0])
    ? brand.hostnames![0]
    : window.location.hostname

  const page = window.location.pathname

  ReactGA.initialize(analyticsId)
  ReactGA.ga('create', analyticsId, 'auto', hostname)
  ReactGA.set({ page })
  ReactGA.pageview(page)
}
