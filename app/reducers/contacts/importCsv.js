import * as types from '../../constants/contacts'
import _ from 'underscore'

const initialState = {
  file: null,
  csvFileId: null,
  currentWizardStep: types.CONTACTS__IMPORT_CSV__STEP_SELECT_FILE,
  isCurrentStepValid: false,
  columns: [],
  rowsCount: 0,
  mappedFields: {},
  workerId: null,
  workerState: null
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
        columns: action.columns,
        errors: action.errors,
        rowsCount: action.rowsCount
      }

    case types.CONTACTS__IMPORT_CSV__UPDATE_MAPPING:
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

    case types.CONTACTS__IMPORT_CSV__SET_WORKER_ID:
      return {
        ...state,
        workerState: null,
        workerId: action.id
      }

    case types.CONTACTS__IMPORT_CSV__SET_WORKER_STATE:
      return {
        ...state,
        workerState: action.state
      }

    case types.CONTACTS__IMPORT_CSV__SET_CSV_FILE:
      return {
        ...state,
        csvFileId: action.csvFileId
      }

    case types.CONTACTS__IMPORT_CSV__RESET:
      return initialState

    default:
      return state
  }
}
