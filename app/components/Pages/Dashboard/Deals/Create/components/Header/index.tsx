import React from 'react'
import { IconButton, makeStyles, Theme, Typography } from '@material-ui/core'
import { useDispatch } from 'react-redux'

import { mdiClose } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { confirmation } from 'actions/confirmation'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      position: 'sticky',
      top: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#fff',
      padding: theme.spacing(1, 4),
      zIndex: 1
    },
    closeButton: {
      marginLeft: theme.spacing(1)
    }
  }),
  {
    name: 'DealCreate-Header'
  }
)

interface Props {
  title: string
  actions?: React.ReactNode
  confirmationMessage: string
  onClose: () => void
}

export function Header({
  title,
  actions,
  confirmationMessage,
  onClose
}: Props) {
  const classes = useStyles()
  const dispatch = useDispatch()

  const handleClose = () => {
    dispatch(
      confirmation({
        message: confirmationMessage,
        description: 'By canceling you will lose your work.',
        confirmLabel: 'Yes, Cancel',
        cancelLabel: 'No, Dont cancel',
        onConfirm: onClose
      })
    )
  }

  return (
    <div className={classes.root}>
      <div>
        <Typography variant="h6">{title}</Typography>
      </div>

      <div>
        {actions}
        <IconButton
          color="secondary"
          size="medium"
          className={classes.closeButton}
          onClick={handleClose}
        >
          <SvgIcon path={mdiClose} size={muiIconSizes.xlarge} />
        </IconButton>
      </div>
    </div>
  )
}
