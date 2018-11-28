import { addNotification as notify } from 'reapop'

import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'

import { asyncDeleteFile } from '../delete-file'
import { changeNeedsAttention } from '../../task'

/**
 * move a file from a task to another task
 */
export function moveTaskFile(user, dealId, task, file, notifyOffice) {
  return async dispatch => {
    try {
      let response
      let fileData

      /*
      * if task is defined, file should create inside the given task
      * if task isn't defined, file should create on deal stash
      */
      if (task) {
        response = await Deal.createTaskFile(task.id, { file: file.id })
        fileData = response.body.data

        // post file logs into task's comments
        Deal.createTaskMessage(task.id, {
          author: user.id,
          room: task.room.id,
          attachments: [fileData.id]
        }).then(() => null)
      } else {
        response = await Deal.createDealFile(dealId, { file: file.id })
        fileData = response.body.data
      }

      /*
      * remove file from it's current place (task or stash based on given task)
      */
      await dispatch(
        asyncDeleteFile(dealId, {
          [file.id]: file.task ? { id: file.task.id } : null
        })
      )

      if (task) {
        dispatch({
          type: actionTypes.ADD_TASK_FILE,
          task_id: task.id,
          file: fileData
        })
      } else {
        dispatch({
          type: actionTypes.ADD_STASH_FILE,
          deal_id: dealId,
          file: fileData
        })
      }

      if (notifyOffice && task) {
        dispatch(changeNeedsAttention(dealId, task.id, true))
      }

      return fileData
    } catch (e) {
      console.log(e)
      dispatch(
        notify({
          title: e.message,
          message:
            e.response && e.response.body ? e.response.body.message : null,
          status: 'error'
        })
      )
    }
  }
}
