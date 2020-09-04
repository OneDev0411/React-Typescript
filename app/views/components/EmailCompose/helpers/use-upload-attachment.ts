import { useField } from 'react-final-form'

import {
  uploadEmailAttachment,
  UploadOrigin
} from 'models/email/upload-email-attachment'

export function useUploadAttachment(
  uploader: typeof uploadEmailAttachment,
  origin?: UploadOrigin
) {
  const field = useField('uploadingAttachments')

  const upload = (files: FileList | File[]) => {
    const fileArray = [...files]
    const file = fileArray[0]

    if (file) {
      field.input.onChange([
        ...(field.input.value || []),
        {
          file,
          request: uploader(file, origin),
          key: Date.now() // No multiple file selection to upload, thus it's an unique key among the uploading files.
        }
      ])
    }
  }

  return [upload]
}
