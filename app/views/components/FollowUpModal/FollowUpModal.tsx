import React, { useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addNotification as notify } from 'reapop'
import { Button, makeStyles, Theme, Typography } from '@material-ui/core'

import { createTask } from 'models/tasks/create-task'
import { EventDrawer } from 'components/EventDrawer'
import { preSaveFormat } from 'components/EventDrawer/helpers/pre-save-format'
import Dialog from 'components/Dialog'
import { IAppState } from 'reducers'
import { noop } from 'utils/helpers'

import { FollowUpEmail } from './types'
import { getFollowUpCrmTask } from './helper/get-follow-up-crm-task'
import { getInitialDate } from './helper/get-initial-date'

const useStyles = makeStyles((theme: Theme) => ({
  description: {
    marginBottom: theme.spacing(2)
  },
  optionButton: {
    marginBottom: theme.spacing(2)
  }
}))

export interface Props {
  email?: FollowUpEmail
  baseDate?: Date
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
  email = undefined,
  onClose,
  callback = noop
}: Props) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const user = useSelector<IAppState, IUser>(state => state.user)
  const [creatingFollowUp, setCreatingFollowUp] = useState(false)
  const [isEventDrawerOpen, setIsEventDrawerOpen] = useState(false)
  const { oneDayTimestamp, todayTimestamp, tomorrowTimestamp } = useMemo(
    () => getInitialDate(baseDate),
    [baseDate]
  )
  const crmTask = useMemo(
    () =>
      getFollowUpCrmTask(email, new Date(tomorrowTimestamp), user, dictionary),
    [dictionary, email, tomorrowTimestamp, user]
  )

  const disabled = isEventDrawerOpen || creatingFollowUp

  const handleClose = () => {
    onClose()
  }

  const setFollowUp = async event => {
    if (disabled) {
      return
    }

    let dueDate = tomorrowTimestamp
    const { dueDateType } = event.currentTarget.dataset

    switch (dueDateType) {
      case 'day':
        dueDate = tomorrowTimestamp
        break
      case 'week':
        dueDate = todayTimestamp + 7 * oneDayTimestamp
        break
      default:
        break
    }

    if (dueDateType === 'custom') {
      setIsEventDrawerOpen(true)
    } else {
      setCreatingFollowUp(true)

      const task = await preSaveFormat(
        getFollowUpCrmTask(email, new Date(dueDate), user, dictionary)
      )

      const followUpTask = await createTask(task)

      callback(followUpTask)
      onClose()
      setCreatingFollowUp(false)

      dispatch(
        notify({
          status: 'success',
          message: 'The follow up task is added!'
        })
      )
    }
  }

  return (
    <>
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
          fullWidth
          variant="outlined"
          color="secondary"
          disabled={disabled}
          onClick={setFollowUp}
          data-due-date-type="day"
          className={classes.optionButton}
        >
          Tomorrow
        </Button>
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          disabled={disabled}
          onClick={setFollowUp}
          data-due-date-type="week"
          className={classes.optionButton}
        >
          Next Week
        </Button>
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          disabled={disabled}
          onClick={setFollowUp}
          data-due-date-type="custom"
          className={classes.optionButton}
        >
          Custom
        </Button>
      </Dialog>
      {isEventDrawerOpen && (
        <EventDrawer
          isOpen
          initialValues={crmTask}
          title="Add a follow up"
          submitCallback={(event, action) => {
            callback(event)
            setIsEventDrawerOpen(false)
            onClose()
          }}
          onClose={() => setIsEventDrawerOpen(false)}
        />
      )}
    </>
  )
}
