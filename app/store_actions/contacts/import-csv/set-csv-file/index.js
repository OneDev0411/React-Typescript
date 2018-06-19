import * as types from '../../../../constants/contacts'

export function setCsvFileId(id) {
  return {
    type: types.CONTACTS__IMPORT_CSV__SET_CSV_FILE,
    csvFileId: id
  }
}
