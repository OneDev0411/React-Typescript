import { HTMLProps, memo, useEffect, useRef } from 'react'

import { fitImageIntoCanvas } from './helper'

interface Props {
  src: string
  alt: string
}

function CanvasImage({
  src,
  alt,
  ...rest
}: Props & HTMLProps<HTMLCanvasElement>) {
  const canvasRef = useRef<Nullable<HTMLCanvasElement>>(null)

  useEffect(() => {
    const canvas = canvasRef.current

    const baseImage = new Image()

    baseImage.src = src
    baseImage.alt = alt
    baseImage.onload = () => {
      const context = canvas?.getContext('2d')

      if (canvas && context) {
        context.drawImage(
          ...fitImageIntoCanvas(baseImage, canvas.width, canvas.height)
        )
      }
    }
  }, [alt, src])

  return <canvas {...rest} ref={ref => (canvasRef.current = ref)} />
}

export default memo(CanvasImage)
