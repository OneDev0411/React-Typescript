// MobileSplashViewer.js
import React from 'react'
import S from 'shorti'

import ActionButton from 'views/components/Button/ActionButton'
import { primary } from 'views/utils/colors'

import config from '../../../config/public'

export default function Mobile({ location }) {
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
    <div
      style={S(
        'absolute t-0 z-1000 l-0 w-100p h-100p bg-000 color-fff bg-url(/static/images/mobile/mask@3x.jpg) bg-center bg-cover'
      )}
    >
      <div style={S('bg-263445 absolute t-0 l-0 w-100p h-100p op-.7 z-9')} />
      <div style={S('color-fff z-10 relative text-center')}>
        <div style={S('mt-50 mb-30')}>
          <img style={S('h-60')} src="/static/images/logo--white.svg" alt="" />
        </div>
        {location && location.query.type === 'iphone' ? (
          <div>
            <p style={{ fontSize: '18px', padding: '2rem' }}>
              Our mobile web version is temporarily unavailable. Please use your
              desktop browser to access Rechat.com or use the mobile iOS App.
            </p>
            <ActionButton
              style={{
                backgroundColor: primary
              }}
              onClick={() => {
                document.location = 'rechat://'
                loadAppByUri(config.itunes_url)
              }}
            >
              Open in my Rechat App
            </ActionButton>
            <p style={{ fontSize: '18px', padding: '2rem' }}>
              If you don't have the app, you can get it from the App Store:
            </p>
            <ActionButton
              style={{
                backgroundColor: primary
              }}
              onClick={() => {
                document.location = config.itunes_url
              }}
            >
              Install the App
            </ActionButton>
          </div>
        ) : (
          <div style={{ fontSize: '18px', padding: '2rem' }}>
            Our mobile web version is temporarily unavailable. Please use your
            desktop browser to access Rechat.com.
          </div>
        )}
      </div>
      <div style={S('text-center color-fff absolute w-100p b-30 z-11')}>
        Powered by&nbsp;
        <span style={S('fw-600')}>
          Rechat
          <sup>TM</sup>
        </span>
      </div>
    </div>
  )
}
