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
    if (typeof window !== 'undefined') {
      window.location.reload(true)
    }

    return <div>Oops... something went wrong. please reload your browser to continue</div>
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
        delay: 4000,
        timeout: 20000
      },
      opts
    )
  )

  if (opts.fetchData) {
    Component.fetchData = opts.fetchData
  }

  return Component
}
