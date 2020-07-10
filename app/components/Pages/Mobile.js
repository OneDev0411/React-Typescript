import React from 'react'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import classNames from 'classnames'

import config from '../../../config/public'

const useStyles = makeStyles(
  theme => ({
    absolute: {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%'
    },
    main: {
      zIndex: 1000,
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      backgroundImage: 'url("/static/images/mobile/mask@3x.jpg")',
      backgroundPosition: 'center',
      backgroundSize: 'cover'
    },
    shadow: {
      background: '#263445',
      opacity: 0.7
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      justifyContent: 'space-between'
    },
    contents: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      flex: '1 1 auto',
      height: 0,
      maxHeight: 500,
      overflow: 'auto',
      justifyContent: 'space-between'
    },
    logoWrapper: {
      paddingTop: 50,
      paddingBottom: 30
    },
    logo: {
      height: theme.spacing(7.5)
    },
    text: {
      fontSize: 18
    },
    footer: {
      paddingTop: 20,
      paddingBottom: 30
    },
    rechat: {
      fontWeight: 600
    }
  }),
  { name: 'Mobile' }
)

export default function Mobile({ location }) {
  const classes = useStyles()

  /**
   * Try to open the external app using URL scheme
   * @param urlNotFoundApp urlNotFoundApp where should go if app not found (if exists)
   */
  let loadAppByUri = urlNotFoundApp => {
    let goToAppPage = null
    let clearEvents
    let setEvents
    let appWasFound
    let appWasNotFound
    let waiting = true

    /**
     * Cross browsers events top capture
     * the app opening
     */
    let eventsName = ['pagehide', 'blur']

    /**
     * If the app was founded
     * stop the timeout
     */
    appWasFound = () => {
      console.log('appWasFound: ', waiting)

      if (!waiting) {
        return false
      }

      waiting = false
      clearEvents()
    }

    /**
     * If app was not founded
     * call the location urlNotFoundApp
     */
    appWasNotFound = () => {
      if (!waiting) {
        return false
      }

      waiting = false
      clearEvents()
      console.log(`Changing location to ${urlNotFoundApp}`, urlNotFoundApp)

      if (urlNotFoundApp) {
        console.log('appWasNotFound')
        document.location = urlNotFoundApp
      }
    }

    /**
     * Set all the events to detected the
     * app being called
     */
    setEvents = () => {
      window.clearTimeout(goToAppPage)
      eventsName.forEach(eventName => {
        console.log('eventName = ', eventName)
        window.addEventListener(eventName, appWasFound)
      })
    }
    /**
     * Clear all the events what was waiting
     * the app calling
     */
    clearEvents = () => {
      console.log('clear events')
      eventsName.forEach(eventName => {
        console.log('eventName = ', eventName)
        window.document.removeEventListener(eventName, appWasFound)
      })
    }

    /**
     * After change the src of the iframe
     * the app caller must call some of
     * the events.
     */
    setEvents()

    /**
     * If none of the events was called
     * after some wait, it is because
     * the app was not founded.
     */
    goToAppPage = setTimeout(appWasNotFound, 2000)
  }

  return (
    <div className={classNames(classes.absolute, classes.main)}>
      <div className={classNames(classes.absolute, classes.shadow)} />
      <div className={classNames(classes.absolute, classes.container)}>
        <div className={classes.contents}>
          <div className={classes.logoWrapper}>
            <img
              className={classes.logo}
              src="/static/images/logo--white.svg"
              alt="Logo"
            />
          </div>
          {location && location.query.type === 'iphone' ? (
            <>
              <p className={classes.text}>
                Our mobile web version is temporarily unavailable. Please use
                your desktop browser to access Rechat.com or use the mobile iOS
                App.
              </p>
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  document.location = 'rechat://'
                  loadAppByUri(config.itunes_url)
                }}
              >
                Open in my Rechat App
              </Button>
              <br />
              <p className={classes.text}>
                If you don't have the app, you can get it from the App Store:
              </p>
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  document.location = config.itunes_url
                }}
              >
                Install the App
              </Button>
            </>
          ) : (
            <div className={classes.text}>
              Our mobile web version is temporarily unavailable. Please use your
              desktop browser to access Rechat.com.
            </div>
          )}
        </div>
        <div className={classes.footer}>
          Powered by&nbsp;
          <span className={classes.rechat}>
            Rechat
            <sup>TM</sup>
          </span>
        </div>
      </div>
    </div>
  )
}
