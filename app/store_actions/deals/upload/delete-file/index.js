import _ from 'underscore'

import * as actionTypes from '../../../../constants/deals'
import { deleteTaskFile, deleteStashFile } from '../../../../models/Deal/file'

function deleteFile({ dealId, fileId, taskId }) {
  return dispatch => {
    if (taskId) {
      return dispatch({
        type: actionTypes.DELETE_TASK_FILE,
        task_id: taskId,
        file_id: fileId
      })
    }

    dispatch({
      type: actionTypes.DELETE_STASH_FILE,
      deal_id: dealId,
      file_id: fileId
    })
  }
}

export function asyncDeleteFile({ dealId, fileId, taskId }) {
  try {
    if (taskId) {
      deleteTaskFile(taskId, fileId)
    } else {
      deleteStashFile(dealId, fileId)
    }

    return deleteFile({ dealId, fileId, taskId })
  } catch (e) {
    throw e
  }
}
