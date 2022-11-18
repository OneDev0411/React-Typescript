import { useEffect, useRef, useState } from 'react'

import { makeStyles, TextField, Theme } from '@material-ui/core'
import { Font } from '@samuelmeuli/font-manager'
import type { Model } from 'backbone'
import Pikaso, { LabelModel } from 'pikaso'
import { useDebounce } from 'react-use'

import OverlayDrawer from '@app/views/components/OverlayDrawer'

import { FontExplorer } from './FontExplorer'

const useStyles = makeStyles(
  (theme: Theme) => ({
    drawerBodyRoot: {
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '100vh',
      overflow: 'auto'
    }
  }),
  {
    name: 'MarketingCenterBlocksCanvasTextDrawer'
  }
)

interface Props {
  model: Nullable<Model>
  onUpdate: (data: { image: string; text: string }) => void
  onClose: () => void
}

export function CanvasTextDrawer({ model, onUpdate, onClose }: Props) {
  const classes = useStyles()

  const [textValue, setTextValue] = useState('Type your text here')
  const [debouncedTextValue, setDebouncedTextValue] = useState(textValue)

  const editorRef = useRef<Nullable<HTMLDivElement>>(null)
  const [editor, setEditor] = useState<Nullable<Pikaso>>(null)

  useDebounce(
    () => {
      setDebouncedTextValue(textValue)
    },
    500,
    [textValue]
  )

  useEffect(() => {
    if (!editor || !model) {
      return
    }

    const label = editor.board.activeShapes[0] as LabelModel

    label.updateText({
      text: debouncedTextValue
    })

    const image = label.node.toDataURL({
      pixelRatio: 2
    })

    model.trigger('canvas-text:update', {
      image,
      width: label.width(),
      height: label.height()
    })
  }, [editor, debouncedTextValue, model])

  useEffect(() => {
    if (editor || !editorRef.current) {
      return
    }

    const instance = new Pikaso({
      width: 50,
      height: 50,
      container: editorRef.current
    })

    instance.shapes.label.insert({
      container: {
        x: 0,
        y: 0
      },
      text: {
        text: 'Your Text',
        fontSize: 40,
        lineHeight: 1.1,
        padding: 10,
        fillLinearGradientStartPoint: { x: 0, y: 0 },
        fillLinearGradientEndPoint: { x: 50, y: 50 },
        fillLinearGradientColorStops: [0, 'yellow', 1, 'tomato']
      },
      tag: {}
    })

    setEditor(instance)
  }, [editorRef, editor])

  const handleSelectFont = (font: Font) => {
    const label = editor!.board.activeShapes[0] as LabelModel

    label.textNode.fontFamily(font.family)

    const image = label.node.toDataURL({
      pixelRatio: 2
    })

    model!.trigger('canvas-text:update', {
      image,
      width: label.width(),
      height: label.height()
    })
  }

  return (
    <>
      <OverlayDrawer open hideBackdrop width={400} onClose={onClose}>
        <OverlayDrawer.Header title="Fancy Test" />
        <OverlayDrawer.Body className={classes.drawerBodyRoot}>
          <div>
            <TextField
              autoFocus
              multiline
              fullWidth
              rows={5}
              variant="outlined"
              value={textValue}
              onChange={e => setTextValue(e.target.value)}
            />
          </div>

          <div>
            <FontExplorer onSelect={handleSelectFont} />
          </div>
        </OverlayDrawer.Body>
      </OverlayDrawer>

      <div
        id="editor"
        ref={editorRef}
        style={{
          visibility: 'hidden',
          position: 'absolute',
          left: -9999,
          top: -9999
        }}
      />
    </>
  )
}
