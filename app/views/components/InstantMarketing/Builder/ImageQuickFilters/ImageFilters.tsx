import { useEffect, useRef, useState } from 'react'

import { Box, makeStyles, Theme } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import Pikaso from 'pikaso'

import { Context } from './context'
import { Blur } from './Filters/Blur'
import { Brighten } from './Filters/Brighten'
import { Contrast } from './Filters/Contrast'
import { Emboss } from './Filters/Emboss'
import { Enhance } from './Filters/Enhance'
import { Grayscale } from './Filters/Grayscale'
import { Invert } from './Filters/Invert'
import { Kaleidoscope } from './Filters/Kaleidoscope'
import { Noise } from './Filters/Noise'
import { Pixelate } from './Filters/Pixelate'

const useStyles = makeStyles(
  (theme: Theme) => ({
    editor: {
      height: '180px',
      maxWidth: '300px',
      '& canvas': {
        borderRadius: theme.shape.borderRadius
      }
    },
    skeleton: {
      width: '300px',
      height: '180px',
      borderRadius: theme.shape.borderRadius
    }
  }),
  {
    name: 'ImageFilters'
  }
)

interface Props {
  isOpen: boolean
  image: string
  onChange: (image: string) => void
}

export function ImageFilters({ image, isOpen, onChange }: Props) {
  const classes = useStyles()
  const [editor, setEditor] = useState<Nullable<Pikaso>>(null)
  const editorRef = useRef<Nullable<HTMLDivElement>>(null)

  const updateImage = () => {
    if (!editor) {
      return
    }

    onChange(
      editor.export.toImage({
        pixelRatio: 0.5
      })
    )
  }

  useEffect(() => {
    if (!isOpen) {
      return
    }

    ;(async () => {
      const editor = new Pikaso({
        container: editorRef.current as HTMLDivElement,
        height: 180,
        selection: {
          interactive: false
        },
        history: {
          keyboard: {
            enabled: false
          }
        }
      })

      await editor.loadFromUrl(image)

      setEditor(editor)
    })()
  }, [image, isOpen])

  return (
    <Box display="flex" alignItems="center" height="100%">
      <Box display="flex" alignItems="center" mr={2} position="relative">
        <div className={classes.editor} ref={editorRef} />

        {!editor && <Skeleton variant="rect" className={classes.skeleton} />}
      </Box>

      <Box display="flex" alignItems="center">
        <Context.Provider value={{ editor, updateImage }}>
          <Box display="flex" py={1}>
            <Box mr={3}>
              <Brighten />
              <Blur />
              <Contrast />
              <Emboss />
            </Box>

            <Box mr={3}>
              <Noise />
              <Pixelate />
              <Kaleidoscope />
              <Enhance />
            </Box>

            <Box>
              <Grayscale />
              <Invert />
            </Box>
          </Box>
        </Context.Provider>
      </Box>
    </Box>
  )
}
