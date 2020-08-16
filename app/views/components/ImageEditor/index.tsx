import React, { useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  IconButton,
  Typography,
  makeStyles,
  Theme,
  Button
} from '@material-ui/core'

import 'tui-image-editor/dist/tui-image-editor.css'
import Editor from '@toast-ui/react-image-editor'

import { useEffectOnce } from 'react-use'

import { theme } from './theme'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      padding: 0,
      '& .tui-image-editor-header': {
        display: 'none'
      },
      '& .tui-image-editor-main': {
        top: '0 !important'
      },
      '& .tui-image-editor-menu': {
        background: theme.palette.grey[300]
      }
    }
  }),
  {
    name: 'ImageEditor'
  }
)

interface Props {
  file: IBlobFile
  onClose?: () => void
}

export function ImageEditor({ file, onClose }: Props) {
  const classes = useStyles()
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const editorRef = useRef<{
    getInstance: () => any
  } | null>(null)

  const getEditorInstance = () => editorRef?.current?.getInstance()!

  useEffectOnce(() => {
    const reader = new FileReader()

    reader.onload = () => setImageUrl(reader.result)
    reader.readAsDataURL(file)
  })

  const handleSave = () => {
    // console.log(getEditorInstance().toDataURL())
  }

  return (
    <Dialog open fullScreen onClose={onClose}>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5">Edit Photo</Typography>

          <div>
            <Button onClick={onClose}>Cancel</Button>

            <Button variant="contained" color="secondary" onClick={handleSave}>
              Save
            </Button>
          </div>
        </Box>
      </DialogTitle>

      <DialogContent classes={{ root: classes.root }}>
        {imageUrl && (
          <Editor
            ref={editorRef}
            includeUI={{
              theme,
              loadImage: {
                path: imageUrl,
                name: file.name
              },
              menu: [
                'crop',
                'flip',
                'rotate',
                'draw',
                'shape',
                'icon',
                'filter'
              ],
              initMenu: 'filter',
              menuBarPosition: 'right'
            }}
            selectionStyle={{
              cornerSize: 20,
              rotatingPointOffset: 70
            }}
            usageStatistics={false}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
