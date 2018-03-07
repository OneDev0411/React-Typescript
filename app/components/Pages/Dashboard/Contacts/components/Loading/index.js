import React from 'react'

export default function Loading() {
  return (
    <div className="c-contact-details__saving-cover">
      <span style={{ color: '#2196f3' }}>
        <i className="fa fa-spin fa-spinner" />
        {'  '}
        Saving ...
      </span>
    </div>
  )
}
