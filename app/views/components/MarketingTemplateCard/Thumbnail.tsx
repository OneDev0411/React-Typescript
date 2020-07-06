import React from 'react'

import { getTemplateImage } from 'utils/marketing-center/helpers'
import { PdfThumbnail } from 'components/PdfThumbnail'

interface Props {
  template: IMarketingTemplateInstance | IMarketingTemplate
  className: string
}

export function Thumbnail({ template, className }: Props) {
  if (
    (template as IMarketingTemplateInstance)?.file?.mime === 'application/pdf'
  ) {
    return (
      <PdfThumbnail url={(template as IMarketingTemplateInstance).file.url} />
    )
  }

  const { thumbnail } = getTemplateImage(template)

  if ((template as IMarketingTemplate).video) {
    return <video src={thumbnail} muted autoPlay />
  }

  return (
    <img
      alt={(template as IMarketingTemplateInstance)?.template.name}
      src={thumbnail}
      className={className}
    />
  )
}
