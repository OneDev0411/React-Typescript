import { Button, makeStyles, Theme, Typography } from '@material-ui/core'

import { DateTimePicker } from '@app/views/components/DateTimePicker'
import Dialog from 'components/Dialog'
import { noop } from 'utils/helpers'

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
  const { isCreatingFollowUpTask, createFollowUpTask, validDate } =
    useFollowUpTask({ event, email, baseDate }, (event: IEvent) => {
      callback(event)
      onClose()
    })

  const disabled = isCreatingFollowUpTask

  const handleClose = () => {
    onClose()
  }

  const setFollowUp = async (dueDate: number) => {
    if (disabled) {
      return
    }

    console.log({ dueDate })

    await createFollowUpTask(dueDate)
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
