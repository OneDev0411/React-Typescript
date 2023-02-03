import { useState } from 'react'

import { useEffectOnce } from 'react-use'

import { useIframe } from './use-iframe'

export function useIframeFonts(): [
  FontFace[],
  (fontName: string) => Promise<void>
] {
  const iframe = useIframe()
  const [fonts, setFonts] = useState<FontFace[]>([])

  useEffectOnce(() => {
    iframe.contentDocument!.fonts.ready.then(() => {
      setFonts(Array.from(iframe.contentDocument!.fonts))
    })
  })

  const loadFont = (fontName: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const iframeFonts = iframe.contentDocument!.fonts

      iframeFonts.ready
        .then(() => {
          const font = Array.from(iframeFonts).find(
            font => font.family === fontName
          )

          if (font) {
            font
              .load()
              .then(() => {
                document.fonts.add(font)
                resolve()
              })
              .catch(reject)
          } else {
            reject(new Error('Font not found'))
          }
        })
        .catch(reject)
    })
  }

  return [fonts, loadFont]
}
