import { useEffect, useState } from 'react'

import { Skeleton } from '@material-ui/lab'
import FontFaceObserver from 'fontfaceobserver'

import { useCanvasTextContext } from './hooks/get-canvas-text-context'

interface Props {
  fontName: string
}

export function FontPreview({ fontName }: Props) {
  const [src, setSrc] = useState<Nullable<string>>(null)
  const { getFontPreview } = useCanvasTextContext()

  useEffect(() => {
    const iframe = document.querySelector('.gjs-frame') as HTMLIFrameElement

    if (!iframe) {
      return
    }

    const getPreview = () => {
      const preview = getFontPreview(fontName)

      setSrc(preview)
    }

    new FontFaceObserver(fontName, {}, iframe.contentWindow)
      .load()
      .then(getPreview)
      .catch(getPreview)

    iframe.contentDocument!.fonts.ready.then(() => {})
  }, [fontName, getFontPreview])

  if (!src) {
    return <Skeleton variant="rect" width="130px" height="48px" />
  }

  return <img src={src} alt={fontName} />
}
