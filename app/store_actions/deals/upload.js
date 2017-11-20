import types from '../../constants/deals'

export function setUploadFiles(files, deal, task) {
  return {
    type: types.SET_UPLOAD_FILES,
    deal,
    task,
    files
  }
}

export function clearUploadFiles() {
  return {
    type: types.CLEAR_UPLOAD_FILES
  }
}
