import React from 'react'
import { IconButton, makeStyles, Theme } from '@material-ui/core'
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
      justifyContent: 'flex-end',
      backgroundColor: '#fff',
      padding: theme.spacing(1, 2)
    }
  }),
  {
    name: 'DealCreate-Header'
  }
)

interface Props {
  onClose: () => void
  confirmationMessage: string
}

export function Header({ confirmationMessage, onClose }: Props) {
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
      <IconButton color="secondary" size="medium" onClick={handleClose}>
        <SvgIcon path={mdiClose} size={muiIconSizes.xlarge} />
      </IconButton>
    </div>
  )
}
