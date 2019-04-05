import React from 'react'
import bowser from 'bowser'

import { confirmation } from '../../store_actions/confirmation'

export function checkBrowser() {
  return async dispatch => {
    const browser = bowser.getParser(window.navigator.userAgent)
    const browserInfo = browser.getBrowser()

    const content = (() => {
      switch (browserInfo.name) {
        case 'Microsoft Edge':
          return {
            title: 'Sorry. Microsoft Edge is not a supported browser.',
            description:
              'For the best experience on Rechat, we recommend using Chrome.',
            confirmLabel: 'Get Chrome'
          }
        default:
          return {
            confirmLabel: 'Update Browser',
            title: `Your web browser (${browserInfo.name} ${
              browserInfo.version.split('.')[0]
            }) is out of date.`,
            description: (
              <p>
                We recommend updating your browser to
                <a
                  href="https://www.google.com/chrome/"
                  target="_blank"
                  style={{ margin: 'auto 4px' }}
                >
                  Chrome
                </a>
                for more security, speed and the best experience on Rechat.
              </p>
            )
          }
      }
    })()

    const isValidBrowser = browser.satisfies({
      // declare browsers per OS
      windows: {
        'Internet Explorer': '>12',
        'Microsoft Edge': '<12'
      },
      macos: {
        safari: '>=10'
      },

      // or in general
      chrome: '>=68',
      firefox: '>=61'
    })

    if (isValidBrowser === false) {
      let downloadLink

      switch (browserInfo.name) {
        case 'Internet Explorer':
          downloadLink =
            'https://www.microsoft.com/en-us/download/internet-explorer.aspx'
          break
        case 'Chrome':
        case 'Microsoft Edge':
          downloadLink = 'https://www.google.com/chrome/'
          break
        case 'Firefox':
          downloadLink = 'https://www.mozilla.org/en-US/firefox/new/'
          break
        default:
          break
      }

      dispatch(
        confirmation({
          message: content.title,
          description: content.description,
          confirmLabel: content.confirmLabel,
          cancelLabel: 'No, thanks',
          hideConfirmButton: !downloadLink,
          onConfirm: () => window.open(downloadLink, '_blank')
        })
      )
    }
  }
}
