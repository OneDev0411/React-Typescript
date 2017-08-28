import React from 'react'
import { connect } from 'react-redux'
import { removeAttachment } from '../../../../../../store_actions/deals'

const ComposeAttachments = ({
  esign,
  tasks,
  removeAttachment
}) => (
  <div className="attachments">
    <ul>
      {
        esign.attachments.map(id =>
          <li key={id}>
            <span className="name">
              { tasks[id].title }
            </span>

            <span
              className="remove-attachment"
              onClick={() => removeAttachment(id)}
            >
              <i className="fa fa-times" />
            </span>
          </li>
        )
      }
    </ul>
  </div>
)

export default connect(null, { removeAttachment })(ComposeAttachments)
