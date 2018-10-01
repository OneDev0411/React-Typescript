import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { isBackOffice } from '../../../../../../../utils/user-teams'
import LinkButton from 'components/Button/LinkButton'

const ViewButton = LinkButton.extend`
  margin-right: 1em;
`
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
                <ViewButton
                  appearance="outline"
                  size="small"
                  // className="button"
                  to={`/dashboard/deals/${deal.id}/form-viewer/${task.id}`}
                >
                  View
                </ViewButton>
              ) : (
                <ViewButton
                  appearance="outline"
                  size="small"
                  href={task.submission.file.url}
                  // className="button"
                  target="_blank"
                >
                  View
                </ViewButton>
              )}
            </Fragment>
          )}

          <LinkButton
            appearance="outline"
            size="small"
            to={`/dashboard/deals/${deal.id}/form-edit/${task.id}`}
          >
            Edit
          </LinkButton>
        </div>
      </div>
    </div>
  )
}

export default connect(({ user }) => ({
  isBackOffice: isBackOffice(user)
}))(DigitalForm)
