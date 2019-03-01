import nunjucks from 'nunjucks'

import {
  currencyFilter,
  areaMeterFilter,
  phoneNumberFilter,
  formatDate
} from '../nunjucks-filters'

const env = new nunjucks.Environment()

env.addFilter('currency', currencyFilter)
env.addFilter('area', areaMeterFilter)
env.addFilter('phone', phoneNumberFilter)
env.addFilter('formatdate', formatDate)

export default env
