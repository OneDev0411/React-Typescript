import React from 'react'

import { getTemplateImage } from 'utils/marketing-center/helpers'
import { PdfThumbnail } from 'components/PdfThumbnail'

interface Props {
  template: IMarketingTemplateInstance | IMarketingTemplate
  className: string
}

export function Thumbnail({ template, className }: Props) {
  const { thumbnail } = getTemplateImage(template)

  if (template?.file?.mime === 'application/pdf') {
    return <PdfThumbnail url={template.file.url} />
  }

  if (template.video) {
    return <video src={thumbnail} muted autoPlay />
  }

  return (
    <img alt={template.template.name} src={thumbnail} className={className} />
  )
}
