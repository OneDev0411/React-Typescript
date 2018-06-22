import * as types from '../../../../constants/contacts'

export function setCurrentStepValidation(isValid) {
  return {
    type: types.CONTACTS__IMPORT_CSV__SET_STEP_VALIDATION,
    isValid
  }
}
