import { useEffect, useRef, useState } from 'react'

import {
  Box,
  makeStyles,
  Theme,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  ClickAwayListener
} from '@material-ui/core'
import Pikaso, { EventListenerCallbackEvent } from 'pikaso'

import type { Filter as ImageFilter } from '@app/hooks/use-image-filters'
import { convertUrlToImageFile } from '@app/utils/file-utils/convert-url-to-image-file'

import { Cropper } from './actions/Crop/Button'
import { CropMenu } from './actions/Crop/Menu'
import { Draw } from './actions/Draw/Button'
import { DrawMenu } from './actions/Draw/Menu'
import { Filter } from './actions/Filter/Button'
import { FilterMenu } from './actions/Filter/Menu'
import { Flip } from './actions/Flip'
import { Redo } from './actions/History/Redo'
import { Undo } from './actions/History/Undo'
import { Image } from './actions/Image/Button'
import { Rotation } from './actions/Rotation'
import { Text } from './actions/Text/Button'
import { TextMenu } from './actions/Text/Menu'
import { ImageEditorContext } from './context'
import { Actions, HistoryEvent } from './types'

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
  cropperOptions?: {
    circular?: boolean
  }
  onClose: () => void
  onSave: (image: File) => void
}

export function EditorDialog({
  file,
  dimensions,
  cropperOptions,
  onClose,
  onSave
}: Props) {
  const classes = useStyles()
  const editorRef = useRef<Nullable<HTMLDivElement>>(null)

  const [editor, setEditor] = useState<Nullable<Pikaso>>(null)
  const [activeAction, setActiveAction] = useState<Actions | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [activeFilter, setActiveFilter] = useState<Nullable<ImageFilter>>(null)
  const [history, setHistory] = useState<Nullable<HistoryEvent['data']>>({
    canRedo: false,
    canUndo: false,
    step: 1,
    total: 1
  })

  const setupEditor = () => {
    const editor = new Pikaso({
      container: editorRef.current as HTMLDivElement,
      height: 500,
      selection: {
        keyboard: {
          enabled: false
        } as any
      }
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

  useEffect(() => {
    const onSelectionChange = (e: EventListenerCallbackEvent) => {
      if ((e.shapes?.length ?? 0) > 1) {
        editor?.selection.deselectAll()
        e.shapes?.[0].select()
      }
    }

    const updateHistory = (e: HistoryEvent) =>
      setHistory({
        ...e.data,
        canUndo: e.data.step > 1
      })

    const onHistoryChange = (e: EventListenerCallbackEvent) => {
      setHistory({
        canRedo:
          editor!.history.getStep() < editor!.history.getList().length - 1,
        canUndo: editor!.history.getStep() > 1,
        total: editor!.history.getList().length,
        step: editor!.history.getStep()
      })
    }

    editor?.on('selection:change', onSelectionChange)
    editor?.on(['history:undo', 'history:redo'], updateHistory)
    editor?.on('*', onHistoryChange)

    return () => {
      editor?.off('selection:change', onSelectionChange)
      editor?.off(['history:undo', 'history:redo'], updateHistory)
      editor?.off('*', onHistoryChange)
    }
  }, [editor])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isFocused && (e.key === 'Backspace' || e.key === 'Delete')) {
        editor?.selection.list.forEach(shape => shape.delete())
      }
    }

    window.addEventListener('keyup', handleKeyPress)

    return () => {
      window.removeEventListener('keyup', handleKeyPress)
    }
  }, [editor, isFocused])

  const handleSave = async () => {
    if (activeAction === 'crop') {
      editor?.cropper.crop()
      setActiveAction(null)
    }

    const file = await convertUrlToImageFile(
      editor!.export.toImage({
        quality: 2
      })
    )

    onSave(file)
    onClose()
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
              className={classes.saveButton}
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </Box>
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <ClickAwayListener onClickAway={() => setIsFocused(false)}>
          <div
            ref={editorRef}
            className={classes.editor}
            onClick={() => setIsFocused(true)}
          />
        </ClickAwayListener>

        <ImageEditorContext.Provider
          value={{
            editor,
            activeAction,
            history,
            setActiveAction,
            activeFilter,
            setActiveFilter
          }}
        >
          {activeAction && (
            <Box
              display="flex"
              justifyContent="space-between"
              className={classes.actionMenu}
            >
              {activeAction === 'crop' && <CropMenu />}
              {activeAction === 'draw' && <DrawMenu />}
              {activeAction === 'text' && <TextMenu />}
              {activeAction === 'filter' && <FilterMenu file={file} />}
            </Box>
          )}

          <Box
            display="flex"
            justifyContent="space-between"
            className={classes.actionsContainer}
          >
            <Box display="flex" className={classes.actions}>
              <Cropper options={cropperOptions} />
              <Rotation />
              <Flip />
              <Draw />
              <Text />
              <Image />
              <Filter />
            </Box>

            <Box display="flex">
              <Redo />
              <Undo />
            </Box>
          </Box>
        </ImageEditorContext.Provider>
      </DialogContent>
    </Dialog>
  )
}
