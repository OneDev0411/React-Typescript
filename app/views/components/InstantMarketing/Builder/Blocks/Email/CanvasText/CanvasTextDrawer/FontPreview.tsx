import { useEffect, useState } from 'react'

import { Skeleton } from '@material-ui/lab'

import { useCanvasTextContext } from './hooks/get-canvas-text-context'
import { useIframeFonts } from './hooks/use-iframe-fonts'

interface Props {
  fontName: string
}

export function FontPreview({ fontName }: Props) {
  const [src, setSrc] = useState<Nullable<string>>(null)

  const { getFontPreview } = useCanvasTextContext()
  const [, loadFont] = useIframeFonts()

  useEffect(() => {
    if (src) {
      return
    }

    const getPreview = () => {
      const preview = getFontPreview(fontName)

      setSrc(preview)
    }

    loadFont(fontName).then(getPreview).catch(getPreview)
  }, [fontName, getFontPreview, loadFont, src])

  if (!src) {
    return <Skeleton variant="rect" width="130px" height="48px" />
  }

  return <img src={src} alt={fontName} />
}
