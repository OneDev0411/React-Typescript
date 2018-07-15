import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'

/**
 * uploads a file into a task
 */
export function uploadTaskFile(user, task, file, fileName = null) {
  return async dispatch => {
    try {
      const response = await Deal.uploadTaskFile(
        task.id,
        file,
        fileName || file.name
      )

      const fileData = response.body.data

      Deal.createTaskMessage(task.id, {
        author: user.id,
        room: task.room.id,
        attachments: [fileData.id]
      }).then(() => null)

      // add files to attachments list
      dispatch({
        type: actionTypes.ADD_TASK_FILE,
        task_id: task.id,
        file: fileData
      })

      return fileData
    } catch (e) {
      return null
    }
  }
}
