import _ from 'underscore'
import types from '../../constants/deals'

function uuid() {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)

  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`
}

export function setUploadFiles(files, deal, task) {
  return {
    type: types.SET_UPLOAD_FILES,
    files: _.indexBy(files, () => uuid()),
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

export function clearUploadFiles() {
  return {
    type: types.CLEAR_UPLOAD_FILES
  }
}
