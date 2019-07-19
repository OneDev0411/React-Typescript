import React from 'react'
import bowser from 'bowser'

import { confirmation } from '../../store_actions/confirmation'

export function checkBrowser() {
  return async dispatch => {
    const validBrowsers = {
      chrome: 68,
      safari: 10
    }

    const updateLink = {
      chrome: 'https://www.google.com/chrome/',
      safari: 'https://support.apple.com/en-us/HT204416'
    }

    const browser = bowser.getParser(window.navigator.userAgent)
    const browserInfo = browser.getBrowser()
    const name = browserInfo.name
    const version = Number(browserInfo.version.split('.')[0])

    const isValidBrowser = browser.satisfies({
      macos: {
        safari: `>=${validBrowsers.safari}`
      },

      chrome: `>=${validBrowsers.chrome}`
    })

    if (
      isValidBrowser === true &&
      version >= validBrowsers[name.toLowerCase()]
    ) {
      return
    }

    let content = {
      title: `Sorry. ${name} is not a supported browser.`,
      description:
        'For the best experience on Rechat, we recommend using Google Chrome.',
      confirmLabel: 'Get Chrome'
    }

    if (['Chrome', 'Safari'].includes(name)) {
      content = {
        confirmLabel: 'Update Browser',
        title: `Your web browser (${name} ${version}) is out of date.`,
        description: (
          <p>
            We recommend updating your browser to the latest version for more
            security, speed and the best experience on Rechat.
          </p>
        )
      }
    }

    const downloadLink =
      name === 'Safari' ? updateLink.safari : updateLink.chrome

    dispatch(
      confirmation({
        message: content.title,
        description: content.description,
        confirmLabel: content.confirmLabel,
        cancelLabel: 'No, thanks',
        onConfirm: () => window.open(downloadLink, '_blank')
      })
    )
  }
}
