import _ from 'underscore'

import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'

function deleteFile(dealId, files) {
  return dispatch => {
    _.each(files, (task, fileId) => {
      if (task) {
        return dispatch({
          type: actionTypes.DELETE_TASK_FILE,
          task_id: task.id,
          file_id: fileId
        })
      }

      dispatch({
        type: actionTypes.DELETE_STASH_FILE,
        deal_id: dealId,
        file_id: fileId
      })
    })
  }
}

export function asyncDeleteFile(dealId, files) {
  try {
    Deal.deleteFiles(dealId, _.keys(files)).then(() => null)

    return deleteFile(dealId, files)
  } catch (e) {
    throw e
  }
}

export function syncDeleteFile(dealId, files) {
  return async dispatch => {
    try {
      await Deal.deleteFiles(dealId, _.keys(files)).then(() => null)

      return dispatch(deleteFile(dealId, files))
    } catch (e) {
      throw e
    }
  }
}
