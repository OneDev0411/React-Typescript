import React from 'react'

import { FieldRenderProps } from 'react-final-form'

import { Box } from '@material-ui/core'

import { FileAttachment } from '../../components/Attachment/FileAttachment'

export function AttachmentsList(props: FieldRenderProps<any>) {
  const handleRemove = (file: IFile) => {
    const files = (props.input.value as IFile[]).filter(
      item => item.id !== file.id
    )

    props.input.onChange(files as any)
  }

  return (
    <Box my={2}>
      {Array.isArray(props.input.value) &&
        (props.input.value as IFile[]).map(file => (
          <FileAttachment
            key={file.id}
            file={file}
            onDelete={() => handleRemove(file)}
          />
        ))}
    </Box>
  )
}
