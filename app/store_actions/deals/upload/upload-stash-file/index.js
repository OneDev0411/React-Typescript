import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'

export function uploadStashFile(dealId, file, fileName = null) {
  return async dispatch => {
    try {
      const response = await Deal.uploadStashFile(
        dealId,
        file,
        fileName || file.name
      )

      const fileData = response.body.data

      // add files to deal stash
      dispatch({
        type: actionTypes.ADD_STASH_FILE,
        deal_id: dealId,
        file: fileData
      })

      return fileData
    } catch (e) {
      throw e
    }
  }
}
