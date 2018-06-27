import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

const DigitalForm = ({ deal, task, isBackOffice }) => {
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
          {task.submission && (
            <Fragment>
              {isBackOffice ? (
                <Link
                  className="button"
                  to={`/dashboard/deals/${deal.id}/form-viewer/${task.id}`}
                >
                  View
                </Link>
              ) : (
                <a
                  href={task.submission.file.url}
                  className="button"
                  target="_blank"
                >
                  View
                </a>
              )}
            </Fragment>
          )}

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

export default connect(({ deals }) => ({
  isBackOffice: deals.backoffice
}))(DigitalForm)
