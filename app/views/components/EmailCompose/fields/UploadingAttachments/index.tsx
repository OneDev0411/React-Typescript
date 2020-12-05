import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { Box } from '@material-ui/core'

import { useDispatch } from 'react-redux'

import { addNotification } from 'components/notification'

import { UploadingAttachment } from '../../components/Attachment/UploadingAttachment'
import { IUploadingAttachment } from '../../types'

interface Props extends FieldRenderProps<any> {
  onFinish: (file: IFile) => void
}

function UploadingAttachmentsList({ input, ...props }: Props) {
  const dispatch = useDispatch()

  const handleRemove = (uploadingAttachment: IUploadingAttachment) => {
    const files = (input.value as IUploadingAttachment[]).filter(
      item => item !== uploadingAttachment
    )

    input.onChange(files as any)
  }

  const handleFinish = (file: IFile, attachment: IUploadingAttachment) => {
    handleRemove(attachment)
    props.onFinish(file)
  }

  const handleError = (e, attachment: IUploadingAttachment) => {
    handleRemove(attachment)

    // Elvis!
    const message = e?.response?.body?.message ?? 'Could not upload file'

    if (e && e.code !== 'ABORTED') {
      dispatch(
        addNotification({
          message,
          status: 'error'
        })
      )
    }

    console.error('error in uploading attachment', e)
  }

  return (
    <Box>
      {Array.isArray(input.value) &&
        (input.value as IUploadingAttachment[]).map(attachment => (
          <UploadingAttachment
            key={attachment.key}
            attachment={attachment}
            onFinish={file => handleFinish(file, attachment)}
            onDelete={() => handleRemove(attachment)}
            onError={e => handleError(e, attachment)}
          />
        ))}
    </Box>
  )
}

export default UploadingAttachmentsList
