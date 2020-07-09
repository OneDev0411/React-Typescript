import React, { useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addNotification as notify } from 'reapop'
import { Button, makeStyles, Theme, Typography } from '@material-ui/core'

import { createTask } from 'models/tasks/create-task'
import { EventDrawer } from 'components/EventDrawer'
import { preSaveFormat } from 'components/EventDrawer/helpers/pre-save-format'
import Dialog from 'components/Dialog'
import { IAppState } from 'reducers'

import { FollowUpEmail } from './types'
import getFollowUpEmailCrmTask from './helpers/get-follow-up-email-crm-task'

const oneDayTimestamp = 24 * 3600000
const todayTimestamp = new Date().getTime()
const tomorrowTimestamp = todayTimestamp + oneDayTimestamp

const useStyles = makeStyles((theme: Theme) => ({
  description: {
    marginBottom: theme.spacing(2)
  },
  optionButton: {
    marginBottom: theme.spacing(2)
  }
}))

interface Props {
  email: FollowUpEmail
  isOpen: boolean
  onClose: () => void
}

export default function EmailFollowUpModal({ email, onClose, isOpen }: Props) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const user = useSelector<IAppState, IUser>(state => state.user)
  const [isEventDrawerOpen, setIsEventDrawerOpen] = useState(false)
  const crmTask = useMemo(
    () => getFollowUpEmailCrmTask(email, new Date(tomorrowTimestamp), user),
    [email, user]
  )

  const handleClose = () => {
    onClose()
  }

  const setFollowUp = async event => {
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
      const task = await preSaveFormat(
        getFollowUpEmailCrmTask(email, new Date(dueDate), user)
      )

      await createTask(task)

      onClose()

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
        title="Set a follow up?"
        maxWidth="xs"
      >
        <Typography gutterBottom className={classes.description}>
          Growing sales is all about setting the next follow up, put a reminder
          on your calendar now!
        </Typography>
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
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
          submitCallback={onClose}
          onClose={() => setIsEventDrawerOpen(false)}
        />
      )}
    </>
  )
}
