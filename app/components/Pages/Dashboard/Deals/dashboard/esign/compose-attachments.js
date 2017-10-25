import React from 'react'
import { connect } from 'react-redux'
import { removeAttachment, setFormViewer } from '../../../../../../store_actions/deals'
import extractDocumentOfTask from '../../utils/extract-document-of-task'

const ComposeAttachments = ({
  esign,
  tasks,
  deal,
  removeAttachment,
  setFormViewer
}) => {
  return (
    <ul>
      {
        esign.attachments.map(id => {
          const task = tasks[id]
          const file = extractDocumentOfTask(deal, task)

          return (
            <li key={id}>
              <span
                className="name"
                onClick={() => setFormViewer(task, file)}
              >
                { tasks[id].title }
              </span>

              <span className="ctas">
                <i
                  className="fa open-form fa-eye"
                  onClick={() => setFormViewer(task, file)}
                />

                <i
                  className="fa fa-times"
                  onClick={() => removeAttachment(id)}
                />
              </span>
            </li>
          )
        })
      }
    </ul>
  )
}

export default connect(null, { removeAttachment, setFormViewer })(ComposeAttachments)
