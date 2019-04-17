import React from 'react'
import Loadable from 'react-loadable'

const Loader = () => (
  <div
    style={{
      position: 'fixed',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      padding: '25% 0',
      textAlign: 'center'
    }}
  >
    <img
      alt="loader"
      style={{ width: '50px' }}
      src="/static/images/loading-states/grid-blue.svg"
    />
  </div>
)

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

    return <Loader />
  }

  if (isLoading && pastDelay) {
    return <Loader />
  }

  return false
}

export default opts => {
  const Component = Loadable(
    Object.assign(
      {
        loading: LoadingHandler,
        delay: 2000,
        timeout: 40000
      },
      opts
    )
  )

  if (opts.fetchData) {
    Component.fetchData = opts.fetchData
  }

  return Component
}
