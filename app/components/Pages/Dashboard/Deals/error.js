import React from 'react'

function reload() {
  window.location.reload()
}

export default ({
  error,
  deals
}) => {
  const hasError = error && error.action === 'get-deals' && deals === null

  if (!hasError) {
    return false
  }

  return (
    <div className="deals-list">
      <div className="deals-error">
        <img src="/static/images/deals/wifi_signal.svg" />
        <div className="title">Uh oh! You seem to have connection at one point</div>
        {
          <div className="descr">
            Get started by creating a new listing or making an offer.
            <span
              className="link"
              onClick={() => reload()}
            >
              Refresh page
            </span>
          </div>
        }
      </div>
    </div>
  )
}
