import bowser from 'bowser'

import { isUUID } from '../../../utils/validations/is-uuid/is-uuid'

const validBrowsers = {
  chrome: 68,
  safari: 10,
  firefox: 70
}

const downloadLink = {
  chrome: 'https://www.google.com/chrome/',
  safari: 'https://support.apple.com/en-us/HT204416'
}

interface BrowserStatus {
  isSupported: boolean
  isOutdated: boolean
  meta: {
    browserName: string
    browserVersion: number
  }
}

export function browserStatus(): BrowserStatus {
  const browser = bowser.getParser(window.navigator.userAgent)
  const browserInfo = browser.getBrowser()
  const name = browserInfo.name || 'Unknown'
  const version = browserInfo.version
    ? Number(browserInfo.version.split('.')[0])
    : 0

  const isBrowserValid = browser.satisfies({
    macos: {
      safari: `>=${validBrowsers.safari}`
    },

    chrome: `>=${validBrowsers.chrome}`,

    firefox: `>=${validBrowsers.firefox}`,

    mobile: {
      safari: '>=9',
      'android browser': '>3.10'
    }
  })

  const output = {
    isSupported: true,
    isOutdated: false,
    meta: {
      browserName: name,
      browserVersion: version
    }
  }

  if (!isBrowserValid) {
    // browser not supported
    output.isSupported = false
  }

  if (version < validBrowsers[name.toLowerCase()]) {
    // unsupported version
    output.isOutdated = true
  }

  return output
}

export function getMessage(status: BrowserStatus) {
  const output = {
    text: '',
    actionText: '',
    actionLink: ''
  }

  if (!status.isSupported) {
    output.text =
      'For the best experience on Rechat, we recommend using Google Chrome.'
    output.actionText = 'Download'
    output.actionLink = downloadLink.chrome
  }

  if (status.isOutdated === true) {
    output.text = `Your web browser (${status.meta.browserName} ${status.meta.browserVersion}) is out of date.`
    output.actionText = 'Upgrade'
    output.actionLink =
      status.meta.browserName === 'Safari'
        ? downloadLink.safari
        : downloadLink.chrome
  }

  return output
}

export function isListingPage(id: UUID): boolean {
  if (
    id &&
    window &&
    window.location.pathname.includes('/dashboard/mls/') &&
    isUUID(id)
  ) {
    return true
  }

  return false
}
