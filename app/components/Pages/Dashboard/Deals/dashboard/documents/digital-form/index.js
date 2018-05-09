import React from 'react'
import { Link } from 'react-router'

export default ({ deal, task }) => {
  if (!task || !task.form) {
    return false
  }

  return (
    <div className="file">
      <div className="title">Digital Form</div>
      <div className="item digital-form">
        <div className="image">
          <img src="/static/images/deals/digital-form.svg" alt="" />
        </div>

        <div className="name">
          <Link to={`/dashboard/deals/${deal.id}/form-edit/${task.id}`}>
            <span className="link">{task.title}</span>
          </Link>
        </div>

        <div className="actions">
          <Link
            className="button"
            to={`/dashboard/deals/${deal.id}/form-viewer/${task.id}`}
          >
            View
          </Link>

          <Link
            className="button"
            to={`/dashboard/deals/${deal.id}/form-edit/${task.id}`}
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  )
}
