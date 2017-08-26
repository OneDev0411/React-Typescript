import React from 'react'

export default ({
  task,
  onSendComment
}) => (
  <div>
    <button
      className="deal-button add-comment"
      onClick={() => onSendComment()}
    >
      Add Comment
    </button>

    <button
      className="deal-button notify-admin"
      onClick={() => onSendComment(true)}
    >
      Notify Admin
    </button>
  </div>
)
