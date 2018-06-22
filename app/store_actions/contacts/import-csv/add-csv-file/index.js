import * as types from '../../../../constants/contacts'

export function addCsvFile(file) {
  return {
    type: types.CONTACTS__IMPORT_CSV__ADD_FILE,
    file
  }
}
