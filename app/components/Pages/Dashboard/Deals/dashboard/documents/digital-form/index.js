import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { editForm, setFormViewer } from '../../../../../../../store_actions/deals/forms'
import ESignButton from '../../esign/button'
import extractDocumentOfTask from '../../../utils/extract-document-of-task'

const Form = ({
  deal,
  task,
  isBackOffice,
  setFormViewer,
  editForm
}) => {

  if (isBackOffice || !task || !task.form) {
    return false
  }

  const { submission } = task
  const attachments = submission && submission.state === 'Fair' ? [task.id] : []
  const file = extractDocumentOfTask(deal, task)

  return (
    <div className="file">
      <div className="title">Digital Form</div>
      <div className="file-group">
        <div className="item digital-form">
          <div className="image">
            <img src="/static/images/deals/digital-form.svg" />
          </div>

          <div
            className="name"
            onClick={() => setFormViewer(task, file)}
          >
            <span className="link">
              { task.title }
            </span>
          </div>

          <div className="actions">
            <ESignButton
              dealId={task.deal}
              task={task}
              attachments={attachments}
            />

            <button
              className="btn-deal"
              onClick={() => editForm(task)}
            >
              Edit Form
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default connect(({ deals }) => ({
  isBackOffice: deals.backoffice
}), { editForm, setFormViewer })(Form)
