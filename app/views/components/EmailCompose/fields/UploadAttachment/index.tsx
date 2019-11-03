import * as React from 'react'
import { ReactNode } from 'react'
import { Field } from 'react-final-form'

import { uploadEmailAttachment } from 'models/email/upload-email-attachment'

import { IUploadingAttachment } from '../../types'

interface RenderProps {
  upload: (files: FileList | File[]) => void
}
interface Props {
  uploadAttachment: typeof uploadEmailAttachment
  children: ({ upload }: RenderProps) => ReactNode
}

export function UploadAttachment(props: Props) {
  return (
    <Field
      name="uploadingAttachments"
      render={({ input }) => {
        const upload = (files: FileList | File[]) => {
          const fileArray = [...files]
          const file = fileArray[0]

          if (file) {
            input.onChange(([
              ...(input.value || []),
              {
                file,
                request: props.uploadAttachment(file)
              }
            ] as IUploadingAttachment[]) as any)
          }
        }

        return props.children({ upload })
      }}
    />
  )
}
