import React from 'react'
import { browserHistory } from 'react-router'
export default ({

}) => (
  <div className="nav">
    <div className="title">Create New Deal</div>
    <div className="cta">
      <button
        className="deal-button cancel"
        onClick={() => browserHistory.push('/dashboard/deals')}
      >
        X
      </button>
    </div>
  </div>
)
