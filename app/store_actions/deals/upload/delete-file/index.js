import _ from 'underscore'

import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'

export function deleteFile(dealId, files) {
  return async dispatch => {
    try {
      Deal.deleteFiles(dealId, _.keys(files)).then(() => null)

      _.each(files, (task, fileId) => {
        if (task) {
          dispatch({
            type: actionTypes.DELETE_TASK_FILE,
            task_id: task.id,
            file_id
          })
        } else {
          dispatch({
            type: actionTypes.DELETE_STASH_FILE,
            deal_id: dealId,
            file_id: fileId
          })
        }
      })
    } catch (e) {
      throw e
    }
  }
}
