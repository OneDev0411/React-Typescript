import useNotify from '@app/hooks/use-notify'
import useSafeState from '@app/hooks/use-safe-state'

interface UseActionWithNotify {
  isRunning: boolean
  runActionThenNotify: (
    action: () => Promise<void>,
    successMessage: string,
    errorMessage: string
  ) => Promise<void>
}

export function useRunActionThenNotify(): UseActionWithNotify {
  const [isRunning, setIsRunning] = useSafeState(false)
  const notify = useNotify()

  const runActionThenNotify = async (
    action: () => Promise<void>,
    successMessage: string,
    errorMessage: string
  ) => {
    setIsRunning(true)

    try {
      await action()
      notify({
        status: 'success',
        message: successMessage
      })
    } catch (_) {
      notify({
        status: 'error',
        message: errorMessage
      })
    }

    setIsRunning(false)
  }

  return {
    isRunning,
    runActionThenNotify
  }
}
