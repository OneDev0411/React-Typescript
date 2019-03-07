import React from 'react'
import { connect } from 'react-redux'

import _ from 'underscore'

import { InputError } from 'components/Forms/styled'

import { ListAttachmentItem } from 'components/ListAttachmentItem'

function AttachmentsList(props) {
  const handleDelete = attachment => {
    const attachments = _.omit(
      props.input.value,
      item => item.id === attachment.id && item.type === attachment.type
    )

    props.input.onChange(attachments)
  }

  return (
    <div style={{ margin: '1rem 0' }}>
      {_.map(props.input.value, (attachment, index) => (
        <ListAttachmentItem
          key={index}
          attachment={attachment}
          onDelete={handleDelete}
        />
      ))}

      {props.meta.error && props.meta.touched && (
        <InputError>{props.meta.error}</InputError>
      )}
    </div>
  )
}

function mapStateToProps({ deals }) {
  return {
    tasks: deals.tasks
  }
}

export default connect(mapStateToProps)(AttachmentsList)
