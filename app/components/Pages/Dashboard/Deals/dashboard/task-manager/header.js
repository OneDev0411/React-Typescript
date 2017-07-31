import React from 'react'
import Comments from './comments'

export default ({
  task
}) => (
  <div className="heading">
    <span>
      { task.title }
    </span>

    <button
      className="task-btn btn-submit"
    >
      Submit for Review
    </button>
  </div>
)
