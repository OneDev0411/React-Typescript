import _ from 'underscore'
import types from '../../constants/deals'
import uuid from '../../utils/uuid'

export function setUploadFiles(files, deal, task) {
  const indexedFiles = {}

  // I used properties object to keep file attributes, because file object that
  // created by browser shouldn't change, otherwise upload breaks
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
    type: types.SET_UPLOAD_FILES,
    files: indexedFiles,
    deal,
    task
  }
}

export function setUploadAttributes(fileId, attributes) {
  return {
    type: types.SET_UPLOAD_ATTRIBUTES,
    fileId,
    attributes
  }
}

export function resetUploadFiles() {
  return {
    type: types.RESET_UPLOAD_FILES
  }
}
