import * as actionTypes from '../../../../constants/deals'
import uuid from '../../../../utils/uuid'

export function setUploadFiles(files, taskId) {
  const indexedFiles = {}

  files.forEach(file => {
    const uniqId = uuid()

    indexedFiles[uniqId] = {
      id: uniqId,
      fileObject: file,
      properties: {
        notifyOffice: true,
        taskId
      }
    }
  })

  return {
    type: actionTypes.SET_UPLOAD_FILES,
    files: indexedFiles
  }
}
