import React from 'react'
import { browserHistory } from 'react-router'

export default ({
  title,
  onClose = () => browserHistory.push('/dashboard/deals')
}) => (
  <div className="nav">
    <div className="title">{title}</div>
    <div className="cta">
      <button
        className="deal-button cancel"
        onClick={onClose}
      >
        X
      </button>
    </div>
  </div>
)
