import * as types from '../../../../constants/contacts'

export function updateWizardStep(step) {
  return {
    type: types.CONTACTS__IMPORT_CSV__UPDATE_WIZARD_STEP,
    step
  }
}
