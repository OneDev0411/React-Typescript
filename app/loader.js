import React from 'react'
import Loadable from 'react-loadable'

const Loading = () => (
  <div>
    <img src="/static/images/loading-states/loader.svg" />
  </div>
)

export default (opts) => {
  return Loadable(Object.assign({
    loading: Loading,
    render(loadedComponent, props) {
      const { isLoading, timedOut, pastDelay, error } = props

      if (isLoading && pastDelay) {
        return <Loading />
      }

      if (error || (isLoading && timedOut)) {
        return <div>Error! Couldn't load component</div>;
      }

      const Component = loadedComponent.default
      return <Component {...props} />
    },
    delay: 1000,
    timeout: 2000
  }, opts))
}
