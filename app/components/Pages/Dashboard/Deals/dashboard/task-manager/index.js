import React from 'react'

export default ({
  task,
  onCloseTask
}) => {
  if (!task) {
    return false
  }

  return (
    <div>
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
    </div>
  )
}
