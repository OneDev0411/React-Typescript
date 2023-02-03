import { useEffect, useState } from 'react'

import { Skeleton } from '@material-ui/lab'
import { LabelModel } from 'pikaso'

import { useIframeFonts } from './hooks/use-iframe-fonts'

interface Props {
  fontName: string
  textPreviewLabel: Nullable<LabelModel>
}

export function FontPreview({ fontName, textPreviewLabel }: Props) {
  const [src, setSrc] = useState<Nullable<string>>(null)

  const [, loadFont] = useIframeFonts()

  useEffect(() => {
    if (!textPreviewLabel || src) {
      return
    }

    const getPreview = () => {
      const normalizedName = fontName
        .replaceAll('-', ' ')
        .replace(/\B([A-Z])\B/g, ' $1')

      textPreviewLabel.textNode.setAttrs({
        fontFamily: fontName,
        text: normalizedName
      })

      const preview = textPreviewLabel.node.toDataURL({
        pixelRatio: 2
      })

      setSrc(preview)
    }

    loadFont(fontName).then(getPreview).catch(getPreview)
  }, [fontName, textPreviewLabel, loadFont, src])

  if (!src) {
    return <Skeleton variant="rect" width="130px" height="48px" />
  }

  return <img src={src} alt={fontName} />
}
