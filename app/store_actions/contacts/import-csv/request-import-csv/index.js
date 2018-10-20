import _ from 'underscore'

import { importCsv } from '../../../../models/contacts/import-csv'
import { setWorkerId } from '../set-worker-id'

function normalizeMappedFields(fields) {
  const list = {}

  _.each(fields, ({ definitionId, label, index }, name) => {
    if (!definitionId) {
      return false
    }

    list[name] = {
      attribute_def: definitionId,
      label,
      index
    }
  })

  return list
}

export function requestImportCsv(fileId, owner, mappedFields) {
  return async dispatch => {
    try {
      const mappings = normalizeMappedFields(mappedFields)
      const { job_id } = await importCsv(fileId, owner, mappings)

      dispatch(setWorkerId(job_id))
    } catch (e) {
      throw e
    }
  }
}
