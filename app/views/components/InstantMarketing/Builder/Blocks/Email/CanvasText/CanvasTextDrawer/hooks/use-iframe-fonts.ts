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
          const fontFaces = Array.from(iframeFonts).filter(
            ({ family }) => family === fontName
          )

          if ((fontFaces?.length ?? 0) === 0) {
            reject(new Error('Font not found'))

            return
          }

          Promise.all(
            fontFaces.map(fontFace => {
              return new Promise<void>((loadResolve, loadReject) => {
                fontFace
                  .load()
                  .then(() => {
                    document.fonts.add(fontFace)
                    loadResolve()
                  })
                  .catch(loadReject)
              })
            })
          )
            .then(() => resolve())
            .catch(reject)
        })
        .catch(reject)
    })
  }

  return [fonts, loadFont]
}
