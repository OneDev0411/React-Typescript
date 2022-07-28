import { useState } from 'react'

import { Button, makeStyles, Theme, Typography } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'

import { DateTimePicker } from '@app/views/components/DateTimePicker'
import Dialog from 'components/Dialog'
import { preSaveFormat } from 'components/EventDrawer/helpers/pre-save-format'
import { addNotification as notify } from 'components/notification'
import { createTask } from 'models/tasks/create-task'
import { selectUser } from 'selectors/user'
import { noop } from 'utils/helpers'

import { getFollowUpCrmTask } from './helper/get-follow-up-crm-task'
import { useFollowUpTask } from './hooks/useFollowUpTask'
import { FollowUpEmail } from './types'

const useStyles = makeStyles((theme: Theme) => ({
  description: {
    marginBottom: theme.spacing(2)
  },
  optionButton: {
    width: '100%',
    marginBottom: theme.spacing(2)
  }
}))

export interface Props {
  email?: FollowUpEmail
  baseDate?: Date
  event?: any
  isOpen: boolean
  dictionary?: {
    title?: string
    description?: string
    taskTitle?: (item?: string) => string
    taskDescription?: (item: string, dueDate: Date | number) => string
  }
  onClose: () => void
  callback?: (e: IEvent) => void
}

export default function FollowUpModal({
  isOpen,
  baseDate,
  dictionary,
  event = undefined,
  email = undefined,
  onClose,
  callback = noop
}: Props) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [isCreatingFollowUp, setIsCreatingFollowUp] = useState(false)
  const { validDate } = useFollowUpTask({ event, email, baseDate })

  // const crmTask = useMemo(
  //   () =>
  //     getFollowUpCrmTask(email, new Date(tomorrowTimestamp), user, dictionary),
  //   [dictionary, email, tomorrowTimestamp, user]
  // )

  const disabled = isCreatingFollowUp

  const handleClose = () => {
    onClose()
  }

  const setFollowUp = async (dueDate: number) => {
    if (disabled) {
      return
    }

    return console.log({ dueDate })

    if (dueDateType === 'custom') {
      // setIsEventDrawerOpen(true)
    } else {
      setIsCreatingFollowUp(true)

      const task = await preSaveFormat(
        getFollowUpCrmTask(email, new Date(dueDate), user, dictionary)
      )

      const followUpTask = await createTask(task)

      callback(followUpTask)
      onClose()
      setIsCreatingFollowUp(false)

      dispatch(
        notify({
          status: 'success',
          message: 'The follow up task is added!'
        })
      )
    }
  }

  return (
    <Dialog
      id="email-follow-up-dialog"
      open={isOpen}
      onClose={handleClose}
      title={dictionary?.title || 'Set a follow up?'}
      maxWidth="xs"
    >
      <Typography gutterBottom className={classes.description}>
        {dictionary?.description ||
          `Growing sales is all about setting the next follow up, put a reminder
          on your calendar now!`}
      </Typography>
      <Button
        variant="outlined"
        color="secondary"
        disabled={disabled}
        onClick={() => setFollowUp(validDate.tomorrow)}
        className={classes.optionButton}
      >
        Tomorrow
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        disabled={disabled}
        onClick={() => setFollowUp(validDate.nextWeek)}
        className={classes.optionButton}
      >
        Next Week
      </Button>

      <DateTimePicker
        selectedDate={new Date(validDate.baseDate)}
        showTimePicker
        datePickerModifiers={{
          disabled: {
            before: new Date(validDate.baseDate)
          }
        }}
        onClose={(date: Date) => setFollowUp(date?.getTime())}
        saveCaption="Set FollowUp"
      >
        {({ handleOpen }) => (
          <Button
            variant="outlined"
            color="secondary"
            disabled={disabled}
            onClick={handleOpen}
            className={classes.optionButton}
          >
            Custom
          </Button>
        )}
      </DateTimePicker>
    </Dialog>
  )
}
