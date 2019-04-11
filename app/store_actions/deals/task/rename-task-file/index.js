import * as actionTypes from '../../../../constants/deals'
import { renameTaskFile as rename } from '../../../../models/Deal/file'

export function renameTaskFile(taskId, fileId, name) {
  return async dispatch => {
    try {
      const newFileName = name.trim()

      if (!newFileName) {
        return null
      }

      await rename(taskId, fileId, newFileName)

      dispatch({
        type: actionTypes.RENAME_TASK_FILE,
        task_id: taskId,
        file_id: fileId,
        filename: newFileName
      })

      return true
    } catch (e) {
      throw e
    }
  }
}
