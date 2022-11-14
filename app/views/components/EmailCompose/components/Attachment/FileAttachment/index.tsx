import { ComponentProps, useMemo } from 'react'

import { Attachment } from '..'
import { EmailFormValues } from '../../../types'

interface Props extends Omit<ComponentProps<typeof Attachment>, 'children'> {
  file: EmailFormValues['attachments'][number]
}

export function FileAttachment({ file, ...props }: Props) {
  // The best workaround is probably this
  // https://stackoverflow.com/a/8267593/847841
  const fileName = useMemo(() => {
    try {
      return decodeURI(file.name)
    } catch (e) {
      return file.name
    }
  }, [file.name])

  return (
    <Attachment {...props}>
      <a href={file.url} target="_blank">
        {fileName}
      </a>
    </Attachment>
  )
}
