import _ from 'underscore'
import * as actionTypes from '../../../../constants/deals'

export function displaySplitter(files = {}) {
  return {
    type: actionTypes.SET_SPLITTER_DISPLAY,
    files: _.indexBy(files, 'id')
  }
}
