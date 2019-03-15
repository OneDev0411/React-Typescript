import React from 'react'
import _ from 'underscore'

import { ListAttachmentItem } from 'components/ListAttachmentItem'

export function AttachmentsList(props) {
  const handleRemove = attachment => {
    props.input.onChange(
      _.omit(
        props.input.value,
        item => item.id === attachment.id && item.type === attachment.type
      )
    )
  }

  return (
    <div style={{ margin: '1rem 0' }}>
      {_.map(props.input.value, (attachment, index) => (
        <ListAttachmentItem
          key={index}
          attachment={attachment}
          onDelete={handleRemove}
        />
      ))}
    </div>
  )
}
