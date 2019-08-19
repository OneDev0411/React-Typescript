import React from 'react'
import { SnackbarContent, IconButton, Button, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useTheme } from '@material-ui/styles'

import {
  browserStatus,
  generatePropeprMessage,
  isListingPage
} from './CheckBrowser-helpers'
import CloseIcon from '../SvgIcons/Close/CloseIcon'

const useStyles = makeStyles(theme => {
  return {
    snackbar: {
      backgroundColor: theme.palette.warning.light,
      minWidth: '40rem',
      margin: theme.spacing(1),
      zIndex: 2019,
      position: 'fixed',
      left: '50%',
      transform: 'translateX(-50%)',
      color: theme.palette.warning.dark
    }
  }
})

interface CheckBrowserPropsType extends React.FC {
  id: string
  children: React.ReactNode
}

function CheckBrowser(props: CheckBrowserPropsType) {
  const theme = useTheme<Theme>()
  const classes = useStyles()
  const status = browserStatus()
  const message = generatePropeprMessage(status)
  const [isShowSnackbar, setShowSnackbar] = React.useState(
    !status.isSupported || status.isOutdated
  )

  if (process.env.NODE_ENV === 'development' || isListingPage(props.id)) {
    return props.children
  }

  return (
    <>
      {isShowSnackbar && (
        <SnackbarContent
          elevation={0}
          className={classes.snackbar}
          message={message.text}
          action={[
            <Button
              key={message.actionText}
              aria-label={message.actionText}
              color="inherit"
              onClick={() => window.open(message.actionLink, '_blank')}
            >
              {message.actionText}
            </Button>,
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
              onClick={() => setShowSnackbar(false)}
            >
              <CloseIcon fill={theme.palette.warning.dark} />
            </IconButton>
          ]}
        />
      )}
      {props.children}
    </>
  )
}

export default CheckBrowser
