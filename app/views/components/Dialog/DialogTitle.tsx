import React from 'react'
import {
  Theme,
  makeStyles,
  IconButton,
  Typography,
  DialogTitle as MuiDialogTitle
} from '@material-ui/core'

import CloseIcon from 'components/SvgIcons/Close/CloseIcon'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      padding: theme.spacing(2)
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500]
    }
  }),
  {
    name: 'DialogTitle'
  }
)

interface Props {
  children: React.ReactNode
  id: string
  onClose?: () => void
}

function DialogTitle({ children, id, onClose }: Props) {
  const classes = useStyles()

  return (
    <MuiDialogTitle id={id} disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  )
}

export default DialogTitle
