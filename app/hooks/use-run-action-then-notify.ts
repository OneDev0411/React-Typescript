import useNotify from '@app/hooks/use-notify'
import useSafeState from '@app/hooks/use-safe-state'
import { Notification } from '@app/views/components/notification'

interface CustomizedNotification extends Omit<Notification, 'status'> {
  status?: Notification['status']
}

interface UseActionWithNotify {
  isRunning: boolean
  runActionThenNotify: (
    action: () => Promise<void>,
    successMessage: string | CustomizedNotification,
    errorMessage: string | CustomizedNotification
  ) => Promise<void>
}

function getNotificationData(
  status: Notification['status'],
  message: string | CustomizedNotification
): Notification {
  if (typeof message === 'string') {
    return {
      status,
      message
    }
  }

  return { status, ...message }
}

export function useRunActionThenNotify(): UseActionWithNotify {
  const [isRunning, setIsRunning] = useSafeState(false)
  const notify = useNotify()

  const runActionThenNotify = async (
    action: () => Promise<void>,
    successMessage: string | CustomizedNotification,
    errorMessage: string | CustomizedNotification
  ) => {
    setIsRunning(true)

    try {
      await action()
      notify(getNotificationData('success', successMessage))
    } catch (_) {
      notify(getNotificationData('error', errorMessage))
    }

    setIsRunning(false)
  }

  return {
    isRunning,
    runActionThenNotify
  }
}
