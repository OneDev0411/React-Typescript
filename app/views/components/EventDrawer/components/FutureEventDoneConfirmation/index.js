import { useContext, useRef, useEffect } from 'react'
import { useField } from 'react-final-form'

import ConfirmationModalContext from 'components/ConfirmationModal/context'

const DONE_STATUS = 'DONE'

export function FutureEventDoneConfirmation() {
  const confirmation = useContext(ConfirmationModalContext)
  const dueDateField = useField('dueDate')
  const endDateField = useField('endDate')
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
    currentStatus === DONE_STATUS &&
    previousStatus.current !== DONE_STATUS
  ) {
    confirmation.setConfirmationModal({
      message: 'Heads up!',
      description:
        'If you mark this event as done, the event due date will change to now. Are you sure?',
      onConfirm: () => {
        const now = new Date()
        const nowArgs = [now.getFullYear(), now.getMonth(), now.getDate()]

        const newDueDate = new Date(
          dueDateField.input.value.setFullYear(...nowArgs)
        )

        dueDateField.input.onChange(
          new Date(newDueDate.setHours(now.getHours(), now.getMinutes(), 0))
        )

        if (endDateField.input.value) {
          const newEndDate = new Date(
            endDateField.input.value.setFullYear(...nowArgs)
          )

          endDateField.input.onChange(
            new Date(
              newEndDate.setHours(now.getHours() + 1, now.getMinutes(), 0)
            )
          )
        }
      },
      onCancel: () => {
        statusField.input.onChange('PENDING')
      }
    })
  }

  return null
}
