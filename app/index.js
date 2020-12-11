import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'

import Provider from './provider'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    release: process.env.SOURCE_VERSION,
    integrations: [new Integrations.BrowserTracing()],
    beforeSend: (event, hint) => {
      console.log('[ Sentry ] ', hint.originalException)

      return event
    }
  })
}

ReactDOM.render(<Provider />, document.getElementById('app'))
