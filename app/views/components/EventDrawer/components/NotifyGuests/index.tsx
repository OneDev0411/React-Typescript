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
  isDeleting: boolean
  isDisabled: boolean
  currentEvent: ICalendarEvent | null
  onSave: (event) => void
  onDelete: (show: boolean) => void
  onCancel: () => void
}

export const NotifyGuests = ({
  isNew,
  isDisabled,
  isDeleting,
  currentEvent,
  onSave,
  onDelete,
  onCancel
}: Props) => {
  const classes = useStyles()

  const handleNotify = async (show: boolean = false) => {
    if (isDeleting) {
      return onDelete(show)
    }

    if (!currentEvent) {
      return
    }

    const currentMeta = currentEvent.metadata || {}

    const payload = {
      ...currentEvent,
      metadata: {
        ...currentMeta,
        send_updates: show
      }
    }

    await onSave(payload)
  }

  const getTitle = (): string => {
    if (isNew) {
      return 'Create'
    }

    if (isDeleting) {
      return 'Delete'
    }

    return 'Update'
  }

  return (
    <Modal isOpen autoHeight>
      <Box p={4}>
        <Typography variant="subtitle1">{getTitle()} Event</Typography>
        <Typography variant="body2">
          Would you like to send update emails to existing guests?
        </Typography>
        <Box className={classes.submitBtn}>
          <Button
            size="small"
            onClick={onCancel}
            disabled={isDisabled}
            disableElevation
          >
            Cancel
          </Button>
          {!isDisabled ? (
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
              Waiting...
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  )
}
