import { useDispatch } from 'react-redux'

import {
  addNotification as notify,
  Notification
} from 'components/notification'

type UseNotifyReturn = (data: Notification) => void

function useNotify(): UseNotifyReturn {
  const dispatch = useDispatch()

  return (data: Notification) => dispatch(notify(data))
}

export default useNotify
