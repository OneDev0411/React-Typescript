import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { removeAttachment } from '../../../../../../store_actions/deals'

function getAttachmentUrl(deal, attachment) {
  const url = `/dashboard/deals/${deal.id}/form-viewer/${attachment.task_id}`

  if (attachment.type === 'file') {
    return `${url}/attachment/${attachment.file_id}`
  }

  return url
}

const ComposeAttachments = ({ esign, deal, removeAttachment }) => (
  <ul>
    {esign.attachments.map((attachment, index) => (
      <li key={index}>
        <span
          className="name"
          onClick={() =>
            browserHistory.push(getAttachmentUrl(deal, attachment))
          }
        >
          {attachment.name}
        </span>

        <span className="ctas">
          <i
            className="fa fa-times"
            onClick={() => removeAttachment(attachment)}
          />
        </span>
      </li>
    ))}
  </ul>
)

export default connect(null, { removeAttachment })(ComposeAttachments)
