import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

const OfflineBanner = ({ status }) => {
  console.log(status)

  if (status === 'connected') {
    return null
  }

  return (
    <div className="c-offline-banner">
      <span>
        Your computer seems to be offline. We'll trying to reconnect or you can
      </span>
      <button className="c-offline-banner__button deals-info__shadow-buton">
        try now
      </button>.
    </div>
  )
}

OfflineBanner.propTypes = {
  status: PropTypes.string
}

export default connect(({ socket }) => {
  const { status } = socket

  return { status }
})(OfflineBanner)
