import { useState, ReactElement } from 'react'

import { Snackbar, Link, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Alert } from '@material-ui/lab'
import bowser from 'bowser'
import SmartBanner from 'react-smartbanner'
import 'react-smartbanner/dist/main.css'

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

interface CheckBrowserPropsType {
  id: string
  children: ReactElement
}

function CheckBrowser(props: CheckBrowserPropsType) {
  const classes = useStyles()

  const status = browserStatus()

  const { name: operatingSystem } = bowser
    .getParser(window.navigator.userAgent)
    .getOS()

  const [isShowSnackbar, setShowSnackbar] = useState(
    !status.isSupported || status.isOutdated
  )

  if (process.env.NODE_ENV === 'development' || isListingPage(props.id)) {
    return props.children
  }

  let message = getMessage(status)

  if (operatingSystem === 'Android') {
    message = {
      text: 'Android',
      actionText: 'Action Text',
      actionLink:
        'https://play.google.com/store/apps/details?id=com.rechat.mobile'
    }
  } else if (operatingSystem === 'iOS') {
    message = {
      text: 'iOS',
      actionText: 'Action Text',
      actionLink: 'https://apps.apple.com/us/app/rechat/id974093560'
    }
  }

  return (
    <>
      <SmartBanner title="Facebook" />
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
