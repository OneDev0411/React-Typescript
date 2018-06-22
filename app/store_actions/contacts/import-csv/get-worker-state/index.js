import { getImportCsvWorkerState } from '../../../../models/contacts/get-import-csv-worker-state'
import { setWorkerState } from '../set-worker-state'

export function getWorkerState(id) {
  return async dispatch => {
    try {
      const { state } = await getImportCsvWorkerState(id)

      dispatch(setWorkerState(state))

      return state
    } catch (e) {
      throw e
    }
  }
}
