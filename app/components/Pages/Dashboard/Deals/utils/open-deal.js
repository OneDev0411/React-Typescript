import { browserHistory } from 'react-router'
import { batchActions } from 'redux-batched-actions'
import store from '../../../../../stores'
import {
  closeEsignWizard,
  setSelectedTask,
  resetSplitter,
  resetUploadFiles
} from '../../../../../store_actions/deals'

export default function (dealId) {
  const { dispatch } = store

  batchActions([
    dispatch(closeEsignWizard()),
    dispatch(setSelectedTask(null)),
    dispatch(resetUploadFiles()),
    dispatch(resetSplitter())
  ])

  browserHistory.push(`/dashboard/deals/${dealId}`)
}
