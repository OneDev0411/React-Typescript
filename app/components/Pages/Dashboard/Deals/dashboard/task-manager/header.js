import React from 'react'
import Comments from './comments'
import SubmitReview from './submit-review'
export default ({
  task
}) => (
  <div className="heading">
    <span>
      { task.title }
    </span>

    <SubmitReview
      task={task}
    />
  </div>
)
