import * as actionTypes from '../../constants/deals'

export function showInstantMarketingBuilder(display) {
  return {
    type: actionTypes.SHOW_BUILDER,
    display
  }
}
