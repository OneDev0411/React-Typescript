import _ from 'underscore'

import { uploadCsvFile as upload } from '../../../../models/contacts/upload-csv'
import { setCsvFileId } from '../set-csv-file'

export function uploadCsvFile(file) {
  return async dispatch => {
    try {
      const { id } = await upload(file)

      dispatch(setCsvFileId(id))

      return id
    } catch (e) {
      throw e
    }
  }
}
