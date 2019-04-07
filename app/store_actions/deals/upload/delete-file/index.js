import _ from 'underscore'

import * as actionTypes from '../../../../constants/deals'
import { deleteTaskFile, deleteStashFile } from '../../../../models/Deal/file'

function deleteFile({ deal, file, task }) {
  return dispatch => {
    if (task) {
      return dispatch({
        type: actionTypes.DELETE_TASK_FILE,
        task_id: task.id,
        file_id: file.id
      })
    }

    dispatch({
      type: actionTypes.DELETE_STASH_FILE,
      deal_id: deal.id,
      file_id: file.id
    })
  }
}

export function asyncDeleteFile({ deal, file, task }) {
  try {
    if (task) {
      deleteTaskFile(task.id, file.id)
    } else {
      deleteStashFile(deal.id, file.id)
    }

    return deleteFile({ deal, file, task })
  } catch (e) {
    throw e
  }
}
