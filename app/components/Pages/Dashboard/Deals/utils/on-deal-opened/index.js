import { batch } from 'react-redux'

import { resetUploadFiles, setSelectedTask } from 'actions/deals'

import store from '../../../../../../stores'

export default function onDealOpened() {
  const { dispatch } = store

  batch(() => {
    dispatch(setSelectedTask(null))
    dispatch(resetUploadFiles())
  })
}
