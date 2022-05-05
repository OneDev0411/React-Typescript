import { useEffect, useRef, useState } from 'react'

import {
  Box,
  makeStyles,
  Theme,
  Dialog,
  DialogContent,
  DialogTitle,
  Button
} from '@material-ui/core'
import Pikaso from 'pikaso'

import { convertUrlToImageFile } from '@app/utils/file-utils/convert-url-to-image-file'

import { Cropper } from './actions/Crop/Button'
import { CropMenu } from './actions/Crop/Menu'
import { Draw } from './actions/Draw/Button'
import { DrawMenu } from './actions/Draw/Menu'
import { Filter } from './actions/Filter/Button'
import { Flip } from './actions/Flip'
import { Image } from './actions/Image/Button'
import { Rotation } from './actions/Rotation'
import { Text } from './actions/Text/Button'
import { ImageEditorContext } from './context'
import { Actions } from './types'

const useStyles = makeStyles(
  (theme: Theme) => ({
    editor: {
      border: `1px solid ${theme.palette.action.hover}`,
      height: '500px',
      margin: theme.spacing(2)
    },
    dialogContent: {
      padding: 0
    },
    saveButton: {
      marginLeft: theme.spacing(1)
    },
    actionsContainer: {
      width: '100%',
      padding: theme.spacing(1, 2),
      borderTop: `1px solid ${theme.palette.divider}`
    },
    actionMenu: {
      width: '100%',
      padding: theme.spacing(1, 2),
      borderTop: `1px solid ${theme.palette.divider}`
    },
    actions: {
      '& button': {
        marginRight: theme.spacing(1)
      }
    }
  }),
  {
    name: 'ImageEditor'
  }
)

interface Props {
  file: File | string
  dimensions?: [number, number]
  onClose: () => void
  onSave: (image: File) => void
}

export function EditorDialog({ file, dimensions, onClose, onSave }: Props) {
  const classes = useStyles()
  const editorRef = useRef<Nullable<HTMLDivElement>>(null)
  const [editor, setEditor] = useState<Nullable<Pikaso>>(null)
  const [activeAction, setActiveAction] = useState<Actions | null>(null)

  const setupEditor = () => {
    const editor = new Pikaso({
      container: editorRef.current as HTMLDivElement,
      height: 500
    })

    setEditor(editor)
  }

  useEffect(() => {
    if (!editor) {
      return
    }

    const load = async () => {
      const fileBlob =
        typeof file === 'string' ? await convertUrlToImageFile(file) : file

      await editor.loadFromFile(fileBlob)
    }

    load()
  }, [editor, file])

  useEffect(() => {
    if (activeAction !== 'crop' && editor?.cropper.isActive) {
      editor.cropper.stop()
    }
  }, [editor, activeAction])

  const handleSave = () => {}

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
              className={classes.saveButton}
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </Box>
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <div ref={editorRef} className={classes.editor} />

        <ImageEditorContext.Provider
          value={{ editor, activeAction, setActiveAction }}
        >
          {activeAction && (
            <Box
              display="flex"
              justifyContent="space-between"
              className={classes.actionMenu}
            >
              {activeAction === 'crop' && <CropMenu />}
              {activeAction === 'draw' && <DrawMenu />}
            </Box>
          )}

          <Box
            display="flex"
            justifyContent="space-between"
            className={classes.actionsContainer}
          >
            <Box display="flex" className={classes.actions}>
              <Cropper />
              <Rotation />
              <Flip />
              <Draw />
              <Text />
              <Image />
              <Filter />

              {/* {dimensions && (
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
            /> */}
            </Box>

            <Box display="flex">
              {/* <Redo editor={editor} onRedo={resizeEditor} />
            <Undo editor={editor} onUndo={resizeEditor} />
            <Delete editor={editor} /> */}
              +++
            </Box>
          </Box>
        </ImageEditorContext.Provider>
      </DialogContent>
    </Dialog>
  )
}
