import nunjucks from 'nunjucks'

import {
  currencyFilter,
  areaMeterFilter,
  phoneNumberFilter,
  formatDate,
  assetFilter
} from '../nunjucks-filters'

const env = new nunjucks.Environment()

env.addFilter('currency', currencyFilter)
env.addFilter('area', areaMeterFilter)
env.addFilter('phone', phoneNumberFilter)
env.addFilter('formatdate', formatDate)
env.addFilter('asset', assetFilter)

export default env
