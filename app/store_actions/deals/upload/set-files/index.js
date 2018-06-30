import * as actionTypes from '../../../../constants/deals'
import uuid from '../../../../utils/uuid'

export function setUploadFiles(files) {
  const indexedFiles = {}

  files.forEach(file => {
    const uniqId = uuid()

    indexedFiles[uniqId] = {
      id: uniqId,
      fileObject: file,
      properties: {
        notifyOffice: true
      }
    }
  })

  return {
    type: actionTypes.SET_UPLOAD_FILES,
    files: indexedFiles
  }
}
