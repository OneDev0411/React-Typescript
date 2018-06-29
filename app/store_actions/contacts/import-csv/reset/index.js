import * as types from '../../../../constants/contacts'

export function resetCsvImport() {
  return {
    type: types.CONTACTS__IMPORT_CSV__RESET
  }
}
