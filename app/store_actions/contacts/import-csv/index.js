import * as types from '../../../constants/contacts'

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
