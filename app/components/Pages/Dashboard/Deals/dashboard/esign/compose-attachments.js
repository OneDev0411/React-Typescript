import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { removeAttachment } from '../../../../../../store_actions/deals'

const ComposeAttachments = ({ esign, tasks, deal, removeAttachment }) => (
  <ul>
    {esign.attachments.map(id => {
      const task = tasks[id]

      return (
        <li key={id}>
          <span
            className="name"
            onClick={() =>
              browserHistory.push(
                `/dashboard/deals/${deal.id}/form-viewer/${task.id}`
              )
            }
          >
            {tasks[id].title}
          </span>

          <span className="ctas">
            <i className="fa fa-times" onClick={() => removeAttachment(id)} />
          </span>
        </li>
      )
    })}
  </ul>
)

export default connect(null, { removeAttachment })(ComposeAttachments)
