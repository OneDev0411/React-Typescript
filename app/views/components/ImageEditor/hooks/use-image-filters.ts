import { MutableRefObject, useEffect, useState } from 'react'

import Pikaso from 'pikaso'

import { FilterType, ImageFilter } from '../types'

export const FILTERS: Array<FilterType> = [
  {
    js: null,
    name: 'No Filter'
  },
  {
    js: {
      name: 'Posterize',
      options: {
        levels: 100
      }
    },
    name: 'Posterize'
  },
  {
    js: {
      name: 'Sepia'
    },
    name: 'Sepia'
  },
  {
    js: {
      name: 'Blur',
      options: {
        blurRadius: 10
      }
    },
    name: 'Blur'
  },
  {
    js: {
      name: 'Invert'
    },
    name: 'Invert'
  },
  {
    js: {
      name: 'Grayscale'
    },
    name: 'Grayscale'
  },
  {
    js: {
      name: 'Emboss'
    },
    name: 'Emboss'
  },
  {
    js: {
      name: 'Noise'
    },
    name: 'Noise'
  },
  {
    js: {
      name: 'Pixelate',
      options: {
        pixelSize: 10
      }
    },
    name: 'Pixelate'
  }
]

export function useImageFilters(
  file: Nullable<File>,
  ref: MutableRefObject<Nullable<HTMLDivElement>>
) {
  const [editor, setEditor] = useState<Nullable<Pikaso>>(null)
  const [filtersDataUrls, setFiltersDataUrls] = useState<
    Partial<Record<keyof typeof FILTERS, ImageFilter>>
  >({})

  useEffect(() => {
    if (!file) {
      return
    }

    const load = async () => {
      const editor = new Pikaso({
        height: 500,
        container: ref.current as HTMLDivElement
      })

      await editor.loadFromFile(file)

      setEditor(editor)
    }

    load()
  }, [file, ref])

  useEffect(() => {
    if (!editor) {
      return
    }

    setTimeout(() => {
      FILTERS.forEach(async current => {
        if (current.js) {
          editor.board.background.image.addFilter(current.js)
        }

        const dataUrl = editor.export.toImage({
          pixelRatio: 0.5
        })

        if (current.js) {
          editor.board.background.image.removeFilter(current.js)
        }

        setFiltersDataUrls(list => ({
          ...(list || {}),
          [current.name]: dataUrl
        }))
      })
    }, 0)
  }, [editor])

  return filtersDataUrls
}
