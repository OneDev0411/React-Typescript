import { useCallback } from 'react'

import { useDispatch } from 'react-redux'

import {
  addNotification as notify,
  Notification
} from 'components/notification'

type UseNotifyReturn = (data: Notification) => void

function useNotify(): UseNotifyReturn {
  const dispatch = useDispatch()

  return useCallback((data: Notification) => dispatch(notify(data)), [dispatch])
}

export default useNotify
