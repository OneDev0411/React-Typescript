import React, { useContext } from 'react'
import { Box, Backdrop } from '@material-ui/core'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'

import { DangerButton } from 'components/Button/DangerButton'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      zIndex: theme.zIndex.modal
    },
    text: {
      color: '#fff',
      fontSize: theme.typography.h2.fontSize,
      fontWeight: theme.typography.fontWeightBold
    }
  })
)

interface Props {
  isDeleting: boolean
  handleDelete: () => Promise<void>
}

export default function Delete(props: Props) {
  const classes = useStyles()
  const confirmation = useContext(ConfirmationModalContext)

  const onClick = () => {
    confirmation.setConfirmationModal({
      message: 'Delete contact?',
      description:
        'Deleting this contact will remove it from your contacts list, but it will not be removed from any deals.',
      confirmLabel: 'Delete',
      onConfirm: props.handleDelete
    })
  }

  if (props.isDeleting) {
    return (
      <Backdrop open className={classes.root}>
        <Box className={classes.text}>Deleting...</Box>
      </Backdrop>
    )
  }

  return (
    <Box p={3}>
      <DangerButton fullWidth variant="outlined" onClick={onClick}>
        Delete Contact
      </DangerButton>
    </Box>
  )
}
