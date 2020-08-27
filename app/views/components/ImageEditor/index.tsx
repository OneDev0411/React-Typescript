import React, { useState, useRef } from 'react'
import TuiImageEditor from 'tui-image-editor'

import {
  Box,
  makeStyles,
  Theme,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  useTheme
} from '@material-ui/core'

import { Undo } from './plugins/Undo'
import { Redo } from './plugins/Redo'
import { Delete } from './plugins/Delete'
import { Crop } from './plugins/Crop'
import { Draw } from './plugins/Draw'
import { Text } from './plugins/Text'
import { Rotate } from './plugins/Rotate'
import { Image } from './plugins/Image'
import { Flip } from './plugins/Flip'
import { Filters } from './plugins/Filters'
import { CropActions } from './plugins/Crop/CropActions'
import { DrawActions } from './plugins/Draw/DrawActions'
import { TextActions } from './plugins/Text/TextActions'
import { FilterActions } from './plugins/Filters/FilterActions'

import type { Actions, ImageEditor } from './types'

const useStyles = makeStyles(
  (theme: Theme) => ({
    canvas: ({ canvasWidth }: { canvasWidth: number }) => ({
      overflow: 'auto',
      height: '60vh',
      '& .tui-image-editor-canvas-container': {
        margin: '0 auto',
        width: `${canvasWidth}px !important`
      },
      '& canvas': {
        borderRadius: theme.shape.borderRadius
      }
    }),
    menuContainer: {
      marginTop: theme.spacing(1)
    },
    menu: {
      width: '100%',
      padding: theme.spacing(1, 2),
      borderTop: `1px solid ${theme.palette.divider}`
    },
    mainMenu: {
      '& button': {
        marginRight: theme.spacing(1)
      }
    },
    iconsRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      marginBottom: theme.spacing(1.25)
    },
    horizontalDivider: {
      margin: theme.spacing(1.5, 0)
    }
  }),
  {
    name: 'ImageEditor'
  }
)

interface Props {
  file: File
  dimensions?: [number, number]
  onClose: () => void
  onSave: (image: Blob) => void
}

export function Editor({ file, dimensions, onClose, onSave }: Props) {
  const theme = useTheme<Theme>()
  const ref = useRef<HTMLDivElement | null>(null)
  const [editor, setEditor] = useState<ImageEditor | null>(null)
  const [action, setAction] = useState<Actions | null>(null)
  const [blob, setBlob] = useState<File | null>(null)
  const [canvasWidth, setCanvasWidth] = useState(0)
  const classes = useStyles({
    canvasWidth
  })

  const setActiveAction = (action: Actions | null) => setAction(action)

  const resizeEditor = () => {
    if (!ref.current) {
      return
    }

    const canvas = ref.current.getElementsByTagName('canvas')[0]!

    const maxHeight = ref.current.clientHeight
    const ratio =
      Number(canvas.getAttribute('width')!) /
      Number(canvas.getAttribute('height')!)
    const width = maxHeight * ratio

    setCanvasWidth(width)
  }

  const setupEditor = async () => {
    const editor = new TuiImageEditor(ref.current!, {
      usageStatistics: false,
      selectionStyle: {
        cornerSize: 15,
        rotatingPointOffset: 35,
        lineWidth: 5
      }
    }) as ImageEditor

    editor._graphics.setCropSelectionStyle({
      cornerColor: theme.palette.secondary.main,
      cornerSize: 15
    })

    setEditor(editor as ImageEditor)

    const blob =
      typeof file === 'string' ? await imageDataUrlToFile(file) : file

    setBlob(blob)

    await editor.loadImageFromFile(blob as File, file.name)

    resizeEditor()

    editor.clearUndoStack()

    // https://github.com/fabricjs/fabric.js/issues/3695#issuecomment-353360365
    document
      .querySelector('#editor-dialog .MuiDialog-container')!
      .removeAttribute('tabindex')
  }

  const handleSave = async () => {
    onClose()

    const file = await imageDataUrlToFile(
      editor!.toDataURL({
        format: 'jpeg',
        quality: 1
      })
    )

    onSave(file)
  }

  const imageDataUrlToFile = async (url: string) => {
    const response = await fetch(url)
    const bufferData = await response.arrayBuffer()

    return new File([bufferData], 'image.jpg', { type: 'image/jpeg' })
  }

  return (
    <Dialog
      open
      id="editor-dialog"
      fullWidth
      maxWidth="lg"
      onEntered={setupEditor}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          Edit Photo
          <div>
            <Button variant="text" onClick={onClose}>
              Cancel
            </Button>

            <Button
              variant="contained"
              color="secondary"
              style={{
                marginLeft: theme.spacing(1)
              }}
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </Box>
      </DialogTitle>
      <DialogContent
        style={{
          padding: 0
        }}
      >
        <Box>
          <div ref={ref} className={classes.canvas} />

          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            className={classes.menuContainer}
          >
            {editor && (
              <>
                {action && (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    className={classes.menu}
                  >
                    {action === 'crop' && (
                      <CropActions
                        editor={editor}
                        onChangeActiveAction={setActiveAction}
                        onCrop={resizeEditor}
                      />
                    )}

                    {action === 'draw' && (
                      <DrawActions
                        editor={editor}
                        onChangeActiveAction={setActiveAction}
                      />
                    )}

                    {action === 'text' && (
                      <TextActions
                        editor={editor}
                        onChangeActiveAction={setActiveAction}
                      />
                    )}

                    {action === 'filter' && blob && (
                      <FilterActions
                        editor={editor}
                        file={blob}
                        onChangeActiveAction={setActiveAction}
                      />
                    )}
                  </Box>
                )}

                <Box
                  display="flex"
                  justifyContent="space-between"
                  className={classes.menu}
                >
                  <Box display="flex" className={classes.mainMenu}>
                    {dimensions && (
                      <Crop
                        editor={editor}
                        isActive={action === 'crop'}
                        width={dimensions[0]}
                        height={dimensions[1]}
                        onChangeActiveAction={setActiveAction}
                      />
                    )}

                    <Rotate editor={editor} onRotate={resizeEditor} />

                    <Flip editor={editor} />

                    <Draw
                      editor={editor}
                      isActive={action === 'draw'}
                      onChangeActiveAction={setActiveAction}
                    />

                    <Text
                      editor={editor}
                      isActive={action === 'text'}
                      onChangeActiveAction={setActiveAction}
                    />

                    <Image editor={editor} />

                    <Filters
                      editor={editor}
                      isActive={action === 'filter'}
                      onChangeActiveAction={setActiveAction}
                    />
                  </Box>

                  <Box display="flex">
                    <Redo editor={editor} onRedo={resizeEditor} />
                    <Undo editor={editor} onUndo={resizeEditor} />
                    <Delete editor={editor} />
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
