import * as actionTypes from '../../../../constants/deals'

export function setUploadAttributes(fileId, attributes) {
  return {
    type: actionTypes.SET_UPLOAD_ATTRIBUTES,
    fileId,
    attributes
  }
}
