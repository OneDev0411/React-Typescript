import { useField } from 'react-final-form'

import { uploadEmailAttachment } from 'models/email/upload-email-attachment'

import { IUploadingAttachment } from '../types'

export function useUploadAttachment(uploader: typeof uploadEmailAttachment) {
  const field = useField('uploadingAttachments')

  const upload = (files: FileList | File[]) => {
    const fileArray = [...files]
    const file = fileArray[0]

    if (file) {
      field.input.onChange(([
        ...(field.input.value || []),
        {
          file,
          request: uploader(file)
        }
      ] as IUploadingAttachment[]) as any)
    }
  }

  return [upload]
}
