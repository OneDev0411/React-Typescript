import * as types from '../../constants/contacts'
import _ from 'underscore'

const initialState = {
  file: null,
  currentWizardStep: types.CONTACTS__IMPORT_CSV__STEP_SELECT_FILE,
  isCurrentStepValid: false,
  columns: [],
  rows: {},
  meta: {},
  rowsCount: 0,
  mappedFields: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.CONTACTS__IMPORT_CSV__ADD_FILE:
      return {
        ...state,
        file: action.file
      }

    case types.CONTACTS__IMPORT_CSV__UPDATE_WIZARD_STEP:
      return {
        ...state,
        currentWizardStep: action.step,
        isCurrentStepValid: false
      }

    case types.CONTACTS__IMPORT_CSV__SET_STEP_VALIDATION:
      return {
        ...state,
        isCurrentStepValid: action.isValid
      }

    case types.CONTACTS__IMPORT_CSV__SET_INFO:
      return {
        ...state,
        columns: action.info.columns,
        meta: action.info.meta,
        errors: action.info.errors,
        rows: action.info.rows,
        rowsCount: _.size(action.info.rows)
      }

    case types.CONTACTS__IMPORT_CSV__UPDATE_MAPPING:
      if (action.data.hasOwnProperty('field') && action.data.field === null) {
        return {
          ...state,
          mappedFields: _.omit(state.mappedFields, action.column)
        }
      }

      return {
        ...state,
        mappedFields: {
          ...state.mappedFields,
          [action.column]: {
            ...state.mappedFields[action.column],
            ...action.data
          }
        }
      }

    case types.CONTACTS__IMPORT_CSV__RESET:
      return initialState

    default:
      return state
  }
}
