import React from 'react'

import { Field, FieldRenderProps } from 'react-final-form'

import { Box } from '@material-ui/core'

import { FileAttachment } from '../../components/Attachment/FileAttachment'
import UploadingAttachmentsList from '../UploadingAttachments'
import { EmailFormValues } from '../../types'
import { isFileAttachment } from '../../helpers/is-file-attachment'

export function AttachmentsList(props: FieldRenderProps<any>) {
  const handleRemove = (attachment: EmailFormValues['attachments'][number]) => {
    const files = (props.input.value as EmailFormValues['attachments']).filter(
      item => item !== attachment
    )

    props.input.onChange(files as any)
  }

  return (
    <Box mt={2}>
      {Array.isArray(props.input.value) &&
        (props.input.value as EmailFormValues['attachments']).map(
          attachment => (
            <FileAttachment
              key={
                isFileAttachment(attachment) ? attachment.id : attachment.url
              }
              file={attachment}
              onDelete={() => handleRemove(attachment)}
            />
          )
        )}
      <Field
        name="uploadingAttachments"
        onFinish={(file: IFile) => {
          props.input.onChange(([
            ...(props.input.value || []),
            file
          ] as EmailFormValues['attachments']) as any)
        }}
        component={UploadingAttachmentsList}
      />
    </Box>
  )
}
