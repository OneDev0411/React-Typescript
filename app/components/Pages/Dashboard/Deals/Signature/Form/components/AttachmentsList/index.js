import React from 'react'
import { connect } from 'react-redux'

import { ListAttachmentItem } from 'components/ListAttachmentItem'
import { FieldError } from 'components/final-form-fields/FieldError'

function AttachmentsList(props) {
  const handleDelete = attachment => {
    const attachments = props.input.value.filter(
      item => item.id === attachment.id && item.type !== attachment.type
    )

    props.input.onChange(attachments)
  }

  return (
    <div style={{ margin: '1rem 0' }}>
      {Array.isArray(props.input.value) &&
        props.input.value.map((attachment, index) => (
          <ListAttachmentItem
            key={index}
            attachment={attachment}
            onDelete={handleDelete}
          />
        ))}

      <FieldError name={props.input.name} />
    </div>
  )
}

function mapStateToProps({ deals }) {
  return {
    tasks: deals.tasks
  }
}

export default connect(mapStateToProps)(AttachmentsList)
