import React, { useState } from 'react'

import { Box, makeStyles, Theme } from '@material-ui/core'
import { useEffectOnce } from 'react-use'

import { readFileAsDataUrl } from 'utils/file-utils/read-file-as-data-url'

import { ImageEditor, Actions } from '../../../types'

const FILTERS = [
  {
    js: null,
    css: {}
  },
  {
    js: 'sepia',
    css: { filter: 'sepia(100%)' }
  },
  {
    js: 'invert',
    css: { filter: 'invert(1)' }
  },
  {
    js: 'grayscale',
    css: { filter: 'grayscale(1)' }
  },
  {
    js: 'emboss',
    css: { filter: 'hue-rotate(90deg)' }
  },
  {
    js: 'sharpen',
    css: { filter: 'saturate(30%)' }
  }
]

const useStyles = makeStyles(
  (theme: Theme) => ({
    imageFilter: {
      width: theme.spacing(6),
      height: theme.spacing(6),
      borderRadius: theme.shape.borderRadius,
      marginRight: theme.spacing(1),
      borderColor: `1px solid ${theme.palette.divider}`,
      '&:hover': {
        cursor: 'pointer'
      }
    }
  }),
  {
    name: 'ImageEditorFilterActions'
  }
)

interface Props {
  editor: ImageEditor
  file: File
  onChangeActiveAction: (action: Actions | null) => void
}

export function FilterActions({ editor, file, onChangeActiveAction }: Props) {
  const classes = useStyles()
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const [filter, setFilter] = useState<string | null>(null)

  useEffectOnce(() => {
    const load = async () => {
      const data = await readFileAsDataUrl(file)

      setDataUrl(data)
    }

    load()
  })

  const applyFilter = async (name: string | null = null) => {
    if (!name) {
      filter && editor.removeFilter(filter)
      setFilter(null)

      return
    }

    if (filter) {
      await editor.removeFilter(filter)
    }

    editor.applyFilter(name)
    setFilter(name)
  }

  if (!dataUrl) {
    return null
  }

  // TODO: refactor filters to make them large and real
  return (
    <Box display="flex" alignItems="center" width="100%">
      {FILTERS.map((filter, index) => (
        <img
          key={index}
          src={dataUrl}
          className={classes.imageFilter}
          alt={filter.js || 'normal'}
          style={filter.css}
          onClick={() => applyFilter(filter.js)}
        />
      ))}
    </Box>
  )
}
