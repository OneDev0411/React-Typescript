import React from 'react'
import { Snackbar, Link, Theme } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { makeStyles } from '@material-ui/core/styles'

import {
  browserStatus,
  getMessage,
  isListingPage
} from './CheckBrowser-helpers'

const useStyles = makeStyles((theme: Theme) => {
  return {
    snackbar: {
      width: '640px',
      maxWidth: '100%',
      paddingRight: theme.spacing(2)
    }
  }
})

interface CheckBrowserPropsType extends React.FC {
  id: string
  children: React.ReactNode
}

function CheckBrowser(props: CheckBrowserPropsType) {
  const classes = useStyles()
  const status = browserStatus()
  const message = getMessage(status)
  const [isShowSnackbar, setShowSnackbar] = React.useState(
    !status.isSupported || status.isOutdated
  )

  if (process.env.NODE_ENV === 'development' || isListingPage(props.id)) {
    return props.children
  }

  return (
    <>
      {isShowSnackbar && (
        <Snackbar
          open
          className={classes.snackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={() => setShowSnackbar(false)} severity="warning">
            <div>
              <span>{message.text}</span>{' '}
              <Link
                color="secondary"
                rel="noreferrer"
                href={message.actionLink}
                target="_blank"
              >
                {message.actionText}
              </Link>
            </div>
          </Alert>
        </Snackbar>
      )}
      {props.children}
    </>
  )
}

export default CheckBrowser
