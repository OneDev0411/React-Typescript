import React from 'react'
import { Box, Button, Typography, makeStyles, Theme } from '@material-ui/core'

import { Modal } from 'components/Modal'

const useStyles = makeStyles(
  (theme: Theme) => ({
    submitBtn: {
      textAlign: 'right',
      marginTop: theme.spacing(5),
      '& > *:not(:last-child)': {
        marginRight: theme.spacing(0.75)
      }
    }
  }),
  {
    name: 'NotifyGuests'
  }
)

interface Props {
  isNew: boolean
  isSaving: boolean
  currentEvent: ICalendarEvent
  onSave: (event) => void
  onCancel: () => void
}

const NotifyGuests = ({
  isNew,
  isSaving,
  currentEvent,
  onSave,
  onCancel
}: Props) => {
  const classes = useStyles()

  const handleNotify = async (show: boolean = false) => {
    const payload = {
      ...currentEvent,
      metadata: {
        send_updates: show
      }
    }

    await onSave(payload)
  }

  return (
    <Modal isOpen autoHeight>
      <Box p={4}>
        <Typography variant="subtitle1">
          {isNew ? 'Create' : 'Update'} Event
        </Typography>
        <Typography variant="body2">
          Would you like to send update emails to existing guests?
        </Typography>
        <Box className={classes.submitBtn}>
          <Button size="small" onClick={onCancel} disableElevation>
            Cancel
          </Button>
          {!isSaving ? (
            <>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleNotify()}
                disableElevation
              >
                Don't Send
              </Button>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => handleNotify(true)}
                disableElevation
              >
                Send
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              disabled
              disableElevation
            >
              Saving...
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  )
}

export default NotifyGuests
