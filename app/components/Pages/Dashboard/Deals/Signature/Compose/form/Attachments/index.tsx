import React from 'react'

import { useField } from 'react-final-form'
import { useTheme } from '@material-ui/styles'
import { Theme } from '@material-ui/core'

import { FieldError } from 'components/final-form-fields/FieldError'
import { ListAttachmentItem } from 'components/ListAttachmentItem'

export function Attachments() {
  const theme = useTheme<Theme>()
  const field = useField('attachments')

  const handleDelete = (attachment: IDealFile) => {
    const attachments = (field.input.value || []).filter(
      (item: typeof attachment) => item.id !== attachment.id
    )

    field.input.onChange(attachments)
  }

  return (
    <div style={{ margin: theme.spacing(2, 0) }}>
      {(field.input.value || []).map((attachment: IDealFile, index: number) => (
        <ListAttachmentItem
          key={index}
          attachment={attachment}
          onDelete={handleDelete}
        />
      ))}

      <FieldError name={field.name} />
    </div>
  )
}
