import React from 'react'
import Comments from './comments'

export default ({
  task,
  onCloseTask
}) => (
  <div className="heading">
    <span>
      { task.title }
    </span>

    <button
      className="task-btn btn-close"
      onClick={() => onCloseTask()}
    >
      <i className="fa fa-times" />
    </button>

    <button
      className="task-btn btn-submit"
    >
      Submit for Review
    </button>
  </div>
)
