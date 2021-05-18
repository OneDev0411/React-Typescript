import React from 'react'
import Loadable from 'react-loadable'

import { AnimatedLoader } from 'components/AnimatedLoader'

const LoadingHandler = props => {
  const { isLoading, timedOut, pastDelay, error } = props

  if (error || (isLoading && timedOut)) {
    console.log('Error while loading', error)

    if (
      typeof window !== 'undefined' &&
      process.env.NODE_ENV === 'production'
    ) {
      window.location.reload(true)
    }

    return <AnimatedLoader />
  }

  if (isLoading && pastDelay) {
    return <AnimatedLoader />
  }

  return false
}

export default opts => {
  const Component = Loadable({
    loading: LoadingHandler,
    delay: 2000,
    timeout: 40000,
    ...opts
  })

  if (opts.fetchData) {
    Component.fetchData = opts.fetchData
  }

  return Component
}
