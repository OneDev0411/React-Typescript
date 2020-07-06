import React, { useState, useEffect, useRef } from 'react'

import { Skeleton } from '@material-ui/lab'

import importPdfJs from 'utils/import-pdf-js'

interface Props {
  url: string
  style?: React.CSSProperties
}

export function PdfThumbnail({ url, style = {} }: Props) {
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)

      const PDFJS = await importPdfJs()

      const document = await PDFJS.getDocument({
        url,
        disableStream: true,
        disableAutoFetch: true
      })

      const page = await document.getPage(1)

      const viewport = page.getViewport({
        scale: 1
      })

      const { width, height } = viewport

      if (!canvas.current) {
        return
      }

      const context = canvas.current.getContext('2d')

      canvas.current.width = width
      canvas.current.height = height

      page.render({
        canvasContext: context,
        viewport
      })

      setIsLoading(false)
    }

    load()
  }, [url])

  return (
    <>
      {isLoading && <Skeleton variant="rect" animation="wave" />}
      <canvas
        ref={canvas}
        style={{
          maxWidth: '100%',
          ...style
        }}
      />
    </>
  )
}
