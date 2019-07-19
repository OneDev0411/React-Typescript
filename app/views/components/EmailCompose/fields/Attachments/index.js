import React from 'react'

import { ListAttachmentItem } from 'components/ListAttachmentItem'

export function AttachmentsList(props) {
  const handleRemove = attachment => {
    props.input.onChange(
      props.input.value.filter(
        item => item.id !== attachment.id || item.type !== attachment.type
      )
    )
  }

  return (
    <div style={{ margin: '1rem 0' }}>
      {Array.isArray(props.input.value) &&
        props.input.value.map((attachment, index) => (
          <ListAttachmentItem
            key={index}
            attachment={attachment}
            onDelete={handleRemove}
          />
        ))}
    </div>
  )
}
