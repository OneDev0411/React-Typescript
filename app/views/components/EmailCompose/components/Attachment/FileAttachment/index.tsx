import * as React from 'react'
import { ComponentProps } from 'react'

import { Attachment } from '..'

interface Props extends Omit<ComponentProps<typeof Attachment>, 'children'> {
  file: IFile
}

export function FileAttachment({ file, ...props }: Props) {
  return (
    <Attachment {...props}>
      <a href={file.url} target="_blank">
        {decodeURI(file.name)}
      </a>
    </Attachment>
  )
}
