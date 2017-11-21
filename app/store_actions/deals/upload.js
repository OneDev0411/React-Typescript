import _ from 'underscore'
import types from '../../constants/deals'

function uuid() {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)

  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`
}

export function setUploadFiles(files, deal, task) {
  const indexedFiles = {}

  // I used properties object to keep file attributes, because file object that
  // created by browser shouldn't change, otherwise upload breaks
  files.forEach(file => {
    const uniqId = uuid()
    indexedFiles[uniqId] = {
      id: uniqId,
      fileObject: file,
      properties: {}
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

export function displaySplitter(display) {
  return {
    type: types.SET_DISPLAY_SPLITTER,
    display
  }
}

export function clearUploadFiles() {
  return {
    type: types.CLEAR_UPLOAD_FILES
  }
}
