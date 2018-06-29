import React from 'react'

export default ({ title, onClose }) => (
  <div className="nav">
    <div className="title">{title}</div>
    <div className="cta">
      <button className="deal-button cancel" onClick={onClose}>
        X
      </button>
    </div>
  </div>
)
