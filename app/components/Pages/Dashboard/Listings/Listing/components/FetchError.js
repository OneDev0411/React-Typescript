import React from 'react'

const FetchError = ({ message, backButtonHandler }) => (
  <div className="c-listing__loading-error">
    <div className="deals-error">
      <h3 className="title">Something went wrong!</h3>
      <p className="descr">
        Help us improve your experience by sending an error{' '}
        <a href="mailto:support@rechat.com">report</a> or{' '}
        <button
          onClick={backButtonHandler}
          style={{
            padding: 0,
            border: 'none',
            color: '#3388ff',
            background: 'transparent'
          }}
        >
          go back
        </button>{' '}
        to search for properties.
      </p>
    </div>
  </div>
)

export default FetchError
