import { batchActions } from 'redux-batched-actions'

import { resetUploadFiles, setSelectedTask } from 'actions/deals'

import store from '../../../../../../stores'

export default function onDealOpened() {
  const { dispatch } = store

  batchActions([dispatch(setSelectedTask(null)), dispatch(resetUploadFiles())])
}
