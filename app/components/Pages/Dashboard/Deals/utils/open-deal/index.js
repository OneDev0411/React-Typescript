import { browserHistory } from 'react-router'
import { batchActions } from 'redux-batched-actions'

import { setSelectedTask, resetUploadFiles } from 'actions/deals'

import store from '../../../../../../stores'

export default function(dealId) {
  const { dispatch } = store

  batchActions([dispatch(setSelectedTask(null)), dispatch(resetUploadFiles())])

  browserHistory.push(`/dashboard/deals/${dealId}`)
}
