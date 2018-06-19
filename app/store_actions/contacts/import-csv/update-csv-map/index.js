import * as types from '../../../../constants/contacts'

export function updateCsvFieldsMap(column, data) {
  return {
    type: types.CONTACTS__IMPORT_CSV__UPDATE_MAPPING,
    column,
    data
  }
}
