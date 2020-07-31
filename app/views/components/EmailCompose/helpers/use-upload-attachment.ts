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
          request: uploader(file, origin)
        }
      ])
    }
  }

  return [upload]
}
