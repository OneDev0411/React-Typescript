import { addNotification as notify } from 'components/notification'

import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'

import { asyncDeleteFile } from '../delete-file'
import { changeNeedsAttention } from '../../task'

/**
 * move a file from a task to another task
 */
export function moveTaskFile(user, deal, task, file, notifyOffice) {
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
        response = await Deal.createDealFile(deal.id, { file: file.id })
        fileData = response.body.data
      }

      /*
       * remove file from it's current place (task or stash based on given task)
       */
      asyncDeleteFile({
        dealId: deal.id,
        fileId: file.id,
        taskId: file.task || null
      })

      if (task) {
        dispatch({
          type: actionTypes.ADD_TASK_FILE,
          task_id: task.id,
          file: fileData
        })
      } else {
        dispatch({
          type: actionTypes.ADD_STASH_FILE,
          deal_id: deal.id,
          file: fileData
        })
      }

      if (notifyOffice && task) {
        dispatch(changeNeedsAttention(deal.id, task.id, true))
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
