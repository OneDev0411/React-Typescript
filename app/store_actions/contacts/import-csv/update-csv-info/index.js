import * as types from '../../../../constants/contacts'

export function updateCsvInfo(info) {
  return {
    type: types.CONTACTS__IMPORT_CSV__SET_INFO,
    ...info
  }
}
