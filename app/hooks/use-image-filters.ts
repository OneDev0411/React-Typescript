import { useCallback, useEffect, useMemo, useState } from 'react'

import Pikaso from 'pikaso'

import { useLoadScript } from './use-load-script'

export interface Filter {
  name: string
  label: string
  customFn: Nullable<(imageData: ImageData) => void>
  imageData: string
}

const ORIGINAL_IMAGE = 'no-filter'

export const Filters: Pick<Filter, 'name' | 'label'>[] = [
  {
    name: ORIGINAL_IMAGE,
    label: 'Original'
  },
  {
    name: 'vintage',
    label: 'Vintage'
  },
  {
    name: 'haze',
    label: 'Haze'
  },
  {
    name: 'ocean',
    label: 'Ocean'
  },
  {
    name: 'extreme_offset_blue',
    label: 'Extreme Offset Blue'
  },
  {
    name: 'zapt',
    label: 'Zapt'
  },
  {
    name: 'pane',
    label: 'Pane'
  },
  {
    name: 'casino',
    label: 'Casino'
  },
  {
    name: 'neue',
    label: 'Neue'
  },
  {
    name: 'lix',
    label: 'Lix'
  },
  {
    name: 'ryo',
    label: 'Ryo'
  },
  {
    name: 'evening',
    label: 'Evening'
  }
]

export function useImageFilters(
  image: File | string
): [typeof filtersList, typeof resetFilters] {
  const [editor, setEditor] = useState<Nullable<Pikaso>>(null)
  const [filtersList, setFiltersList] = useState<Record<string, Filter>>({})

  const isPixelJsLoaded = useLoadScript(
    'https://cdn.jsdelivr.net/gh/silvia-odwyer/pixels.js/dist/Pixels.js'
  )

  const filters = useMemo(
    () =>
      Filters.map(filter => ({
        ...filter,
        customFn:
          filter.name === ORIGINAL_IMAGE
            ? null
            : (imageData: ImageData) => {
                // eslint-disable-next-line
          const pixelsJS = window['pixelsJS']

                pixelsJS.filterImgData(imageData, filter.name)
              }
      })),
    []
  )

  useEffect(() => {
    const container = document.createElement('div')

    container.style.height = '400px'
    document.body.append(container)

    const init = async () => {
      const editor = new Pikaso({
        container: container as HTMLDivElement
      })

      if (image instanceof File) {
        await editor?.loadFromFile(image)
      }

      if (typeof image === 'string') {
        await editor?.loadFromUrl(image)
      }

      setEditor(editor)
    }

    init()

    return () => {
      container.remove()
    }
  }, [image])

  useEffect(() => {
    if (!editor || !isPixelJsLoaded) {
      return
    }

    filters.forEach(filter => {
      if (filter.customFn) {
        editor.board.background.image.addFilter({
          customFn: filter.customFn
        })
      }

      const data = editor.export.toImage({
        pixelRatio: 0.5
      })

      if (filter.customFn) {
        editor.board.background.image.removeFilter({
          customFn: filter.customFn
        })
      }

      setTimeout(() => {
        setFiltersList(state => ({
          ...state,
          [filter.name]: {
            ...filter,
            imageData: data
          }
        }))
      }, 0)
    })
  }, [filters, editor, isPixelJsLoaded])

  const resetFilters = useCallback(() => {
    setFiltersList({})
  }, [])

  return [filtersList, resetFilters]
}
