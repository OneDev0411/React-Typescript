import { useContext, useRef, useEffect } from 'react'
import { useField } from 'react-final-form'

import ConfirmationModalContext from 'components/ConfirmationModal/context'

const DONE = 'DONE'

export function FutureEventDoneConfirmation() {
  const confirmation = useContext(ConfirmationModalContext)
  const dueDateField = useField('dueDate')
  const statusField = useField('status')
  const currentStatus = statusField.input.value
  const previousStatus = useRef(currentStatus)

  const isFutureDate =
    new Date(dueDateField.input.value).getTime() > new Date().getTime()

  useEffect(() => {
    if (currentStatus !== previousStatus) {
      previousStatus.current = currentStatus
    }
  }, [currentStatus])

  // Set future event due date to now if user wants to mark it as done
  if (
    isFutureDate &&
    !confirmation.isShow &&
    currentStatus === DONE &&
    statusField.meta.active &&
    previousStatus.current !== DONE
  ) {
    confirmation.setConfirmationModal({
      message: 'Heads up!',
      description:
        'If you mark this event as done, the event due date will change to now. Are you sure?',
      onConfirm: () => {
        dueDateField.input.onChange(new Date())
      },
      onCancel: () => {
        statusField.input.onChange('PENDING')
      }
    })
  }

  return null
}
