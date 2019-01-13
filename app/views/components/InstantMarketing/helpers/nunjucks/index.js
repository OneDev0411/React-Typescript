import nunjucks from 'nunjucks'

import {
  currencyFilter,
  areaMeterFilter,
  phoneNumberFilter,
  humanizeTimestamp
} from '../nunjucks-filters'

const env = new nunjucks.Environment()

env.addFilter('currency', currencyFilter)
env.addFilter('area', areaMeterFilter)
env.addFilter('phone', phoneNumberFilter)
env.addFilter('humanizetimestamp', humanizeTimestamp)

export default env
