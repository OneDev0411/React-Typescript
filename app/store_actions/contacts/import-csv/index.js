import { normalize } from 'normalizr'
import * as types from '../../../constants/contacts'
import { contactsSchema } from '../../../models/contacts/schema'
import postBulkContacts from '../../../models/contacts/post-bulk-contacts'
import { getContacts } from '../get-contacts'

export function addCsvFile(file) {
  return {
    type: types.CONTACTS__IMPORT_CSV__ADD_FILE,
    file
  }
}

export function updateWizardStep(step) {
  return {
    type: types.CONTACTS__IMPORT_CSV__UPDATE_WIZARD_STEP,
    step
  }
}

export function setCurrentStepValidation(isValid) {
  return {
    type: types.CONTACTS__IMPORT_CSV__SET_STEP_VALIDATION,
    isValid
  }
}

export function updateCsvInfo(info) {
  return {
    type: types.CONTACTS__IMPORT_CSV__SET_INFO,
    info
  }
}

export function updateCsvFieldsMap(column, data) {
  return {
    type: types.CONTACTS__IMPORT_CSV__UPDATE_MAPPING,
    column,
    data
  }
}

export function resetCsvImport() {
  return {
    type: types.CONTACTS__IMPORT_CSV__RESET
  }
}

export function uploadCsvContacts(contacts) {
  return async dispatch => {
    try {
      const response = await postBulkContacts(contacts)
      const { data, info } = response

      dispatch({
        response: {
          info,
          ...normalize({ contacts: data }, contactsSchema)
        },
        type: types.FETCH_CONTACTS_SUCCESS
      })
    } catch (e) {
      throw e
    }
  }
}
