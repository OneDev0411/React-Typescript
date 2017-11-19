import React from 'react'

const FetchError = ({ message, backButtonkHandler }) => (
  <div className="c-listing__loading-error">
    <h2>404</h2>
    <h3>{`${message}!`}</h3>
    {backButtonkHandler && (
      <button
        style={{
          background: `#${Brand.color('primary', '006aff')}`
        }}
        onClick={backButtonHandler}
      >
        Back
      </button>
    )}
  </div>
)

export default FetchError
