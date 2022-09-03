import { HTMLProps, memo, useEffect, useRef } from 'react'

import Pikaso from 'pikaso'

interface Props {
  width: number
  height: number
  src: string
}

function CanvasImage({
  width,
  height,
  src,
  ...rest
}: Props & HTMLProps<HTMLDivElement>) {
  const containerRef = useRef<Nullable<HTMLDivElement>>(null)

  useEffect(() => {
    const load = async () => {
      const editor = new Pikaso({
        container: containerRef.current as HTMLDivElement,
        selection: {
          interactive: false
        }
      })

      await editor.loadFromUrl(src, {
        size: 'cover',
        x: 0,
        y: 0
      })

      await editor.cropper.crop({
        x: 0,
        y: 0,
        width,
        height
      })

      editor.export.toImage({
        quality: 4
      })
    }

    load()
  }, [height, src, width])

  return (
    <div
      style={{ width, height }}
      {...rest}
      ref={ref => (containerRef.current = ref)}
    />
  )
}

export default memo(CanvasImage)
