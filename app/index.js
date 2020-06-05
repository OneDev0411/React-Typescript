import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/browser'

import Provider from './provider'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    release: process.env.SOURCE_VERSION
  })
}

const rootEl = document.getElementById('app')

ReactDOM.render(<Provider />, rootEl)

if (window != null) {
  window.isSet = object => typeof object !== 'undefined'
}
