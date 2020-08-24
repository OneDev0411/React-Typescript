import React, { useState, useRef } from 'react'
import TuiImageEditor from 'tui-image-editor'

import {
  Box,
  makeStyles,
  Theme,
  ButtonGroup,
  Dialog,
  DialogContent
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
import { CropActions } from './plugins/Crop/CropActions'
import { DrawActions } from './plugins/Draw/DrawActions'
import { TextActions } from './plugins/Text/TextActions'
import type { Actions, ImageEditor } from './types'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      maxHeight: '85vh',
      overflow: 'auto'
    },
    canvas: {
      display: 'flex',
      alignItems: 'center',
      maxHeight: '100vh',
      padding: theme.spacing(1, 0),
      '& .tui-image-editor-canvas-container': {
        margin: '0 auto'
      },
      '& canvas': {
        borderRadius: theme.shape.borderRadius
      },
      backgroundColor: theme.palette.grey[50]
    },
    menu: {
      padding: theme.spacing(1),
      borderTop: `1px solid ${theme.palette.divider}`
    },
    menuContainer: {
      position: 'sticky',
      bottom: 0,
      background: '#fff'
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

const imageWidth = 200
const imageHeight = 200

interface Props {
  file: IBlobFile
}

export function Editor({ file }: Props) {
  const classes = useStyles()
  const ref = useRef<HTMLDivElement | null>(null)
  const [editor, setEditor] = useState<ImageEditor | null>(null)
  const [height, setHeight] = useState('0px')
  const [action, setAction] = useState<Actions | null>(null)

  const setActiveAction = (action: Actions | null) => setAction(action)

  const resizeEditor = () => {
    if (!ref.current) {
      return
    }

    const height = getComputedStyle(ref.current, null).getPropertyValue(
      'max-height'
    )

    setHeight(height)
  }

  const setupEditor = async () => {
    const editor = new TuiImageEditor(ref.current!, {
      selectionStyle: {
        cornerSize: 20,
        rotatingPointOffset: 70
      }
    })

    setEditor(editor)

    await editor.loadImageFromFile(file as File, file.name)

    resizeEditor()

    editor.clearUndoStack()

    // https://github.com/fabricjs/fabric.js/issues/3695#issuecomment-353360365
    document
      .querySelector('#editor-dialog .MuiDialog-container')!
      .removeAttribute('tabindex')
  }

  return (
    <Dialog
      open
      id="editor-dialog"
      fullWidth
      maxWidth="lg"
      onEntered={setupEditor}
    >
      <DialogContent>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          className={classes.root}
        >
          <div
            ref={ref}
            className={classes.canvas}
            style={{
              height
            }}
          />

          {editor && (
            <div className={classes.menuContainer}>
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
                </Box>
              )}

              <Box
                display="flex"
                justifyContent="space-between"
                className={classes.menu}
              >
                <Box display="flex">
                  <ButtonGroup size="small">
                    <Crop
                      editor={editor}
                      isActive={action === 'crop'}
                      width={imageWidth}
                      height={imageHeight}
                      onChangeActiveAction={setActiveAction}
                    />

                    <Rotate
                      editor={editor}
                      isActive={action === 'rotate'}
                      onChangeActiveAction={setActiveAction}
                      onRotate={resizeEditor}
                    />

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
                  </ButtonGroup>
                </Box>

                <Box display="flex">
                  <ButtonGroup size="small">
                    <Redo editor={editor} onRedo={resizeEditor} />
                    <Undo editor={editor} onUndo={resizeEditor} />
                    <Delete editor={editor} />
                  </ButtonGroup>
                </Box>
              </Box>
            </div>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  )
}
