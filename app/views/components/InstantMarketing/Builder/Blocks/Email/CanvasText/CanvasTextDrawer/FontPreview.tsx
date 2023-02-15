import { useEffect, useState } from 'react'

import { Skeleton } from '@material-ui/lab'
import { LabelModel } from 'pikaso'

import type { TemplateFont } from '../../../types'

import { useIframeFonts } from './hooks/use-iframe-fonts'

interface Props {
  font: TemplateFont
  textPreviewLabel: Nullable<LabelModel>
}

export function FontPreview({ font, textPreviewLabel }: Props) {
  const [src, setSrc] = useState<Nullable<string>>(null)

  const [, loadFont] = useIframeFonts()

  useEffect(() => {
    if (!textPreviewLabel || src) {
      return
    }

    const getPreview = () => {
      textPreviewLabel.textNode.setAttrs({
        fontFamily: font.name,
        text: font.name
      })

      const preview = textPreviewLabel.node.toDataURL({
        pixelRatio: 2
      })

      setSrc(preview)
    }

    loadFont(font.name).then(getPreview).catch(getPreview)
  }, [font, textPreviewLabel, loadFont, src])

  if (!src) {
    return <Skeleton variant="rect" width="130px" height="48px" />
  }

  return <img src={src} alt={font.name} />
}
