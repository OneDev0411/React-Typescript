import * as React from 'react'
import { ComponentProps } from 'react'

import { Attachment } from '..'

import { EmailFormValues } from '../../../types'

interface Props extends Omit<ComponentProps<typeof Attachment>, 'children'> {
  file: EmailFormValues['attachments'][number]
}

export function FileAttachment({ file, ...props }: Props) {
  return (
    <Attachment {...props}>
      <a href={file.url} target="_blank">
        {escape(file.name)}
      </a>
    </Attachment>
  )
}
