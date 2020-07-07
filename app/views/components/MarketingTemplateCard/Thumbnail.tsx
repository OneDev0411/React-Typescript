import React from 'react'

import { getTemplateImage } from 'utils/marketing-center/helpers'
import { getFileType } from 'utils/file-utils/get-file-type'

import { PdfThumbnail } from 'components/PdfThumbnail'

interface Props {
  template: IMarketingTemplateInstance | IBrandMarketingTemplate
  className: string
}

export function Thumbnail({ template, className }: Props) {
  if (
    template.type === 'template_instance' &&
    getFileType(template.file) === 'pdf'
  ) {
    return <PdfThumbnail url={template.file.url} />
  }

  const { thumbnail } = getTemplateImage(template)

  if (template.template.video) {
    return <video src={thumbnail} muted autoPlay />
  }

  return (
    <img alt={template.template.name} src={thumbnail} className={className} />
  )
}
