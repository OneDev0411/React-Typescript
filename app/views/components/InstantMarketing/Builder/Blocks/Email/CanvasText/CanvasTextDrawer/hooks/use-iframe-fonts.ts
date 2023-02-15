import { useState } from 'react'

import { useEffectOnce } from 'react-use'

import { useIframe } from './use-iframe'

export function useIframeFonts(): [
  FontFace[],
  (fontName?: string) => Promise<void>
] {
  const iframe = useIframe()
  const [fonts, setFonts] = useState<FontFace[]>([])

  useEffectOnce(() => {
    iframe.contentDocument!.fonts.ready.then(() => {
      setFonts(Array.from(iframe.contentDocument!.fonts))
    })
  })

  const loadFont = (fontName?: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!fontName) {
        reject()

        return
      }

      const iframeFonts = iframe.contentDocument!.fonts

      iframeFonts.ready
        .then(() => {
          const fontFace = Array.from(iframeFonts).find(
            ({ family }) => family === fontName
          )

          if (fontFace) {
            fontFace
              .load()
              .then(() => {
                document.fonts.add(fontFace)
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
