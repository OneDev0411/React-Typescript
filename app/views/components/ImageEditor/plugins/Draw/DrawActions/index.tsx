import React, { useState } from 'react'

import {
  Box,
  useTheme,
  Theme,
  Button,
  Divider,
  makeStyles
} from '@material-ui/core'
import { ColorResult } from 'react-color'

import Icon from '@mdi/react'
import { mdiDraw, mdiVectorLine } from '@mdi/js'

import { useEffectOnce } from 'react-use'

import { Slider } from '../../../components/Slider'
import { ColorPicker } from '../../../components/ColorPicker'
import { ImageEditor, Actions, DRAWING_MODE } from '../../../types'

const useStyles = makeStyles(
  (theme: Theme) => ({
    divider: {
      height: '50%',
      margin: theme.spacing(0, 2)
    }
  }),
  {
    name: 'ImageEditorDrawActions'
  }
)

interface Props {
  editor: ImageEditor
  onChangeActiveAction: (action: Actions | null) => void
}

export function DrawActions({ editor, onChangeActiveAction }: Props) {
  const classes = useStyles()
  const theme = useTheme<Theme>()
  const [drawingMode, setDrawingMode] = useState<DRAWING_MODE>('FREE_DRAWING')

  const [
    activeObject,
    setActiveObject
  ] = useState<tuiImageEditor.IGraphicObjectProps | null>(null)
  const [brushWidth, setBrushWidth] = useState(5)
  const [brushColor, setBrushColor] = useState('#000')

  useEffectOnce(() => {
    const capture = (event: KeyboardEvent) => {
      if (event.code === 'Enter') {
        event.stopPropagation()

        if (
          ['FREE_DRAWING', 'LINE_DRAWING'].includes(editor.getDrawingMode())
        ) {
          editor.stopDrawingMode()
        } else {
          setActiveObject(null)
          editor.startDrawingMode(drawingMode, getBrushSettings())
        }
      }
    }

    document.addEventListener('keydown', capture)

    editor.on(
      'objectActivated',
      (object: tuiImageEditor.IGraphicObjectProps) => {
        if (object.type && ['path', 'line'].includes(object.type)) {
          setActiveObject(object)
          setBrushWidth(object.strokeWidth as number)
        }
      }
    )

    return () => {
      document.removeEventListener('keydown', capture)
      editor.off('objectActivated')
    }
  })

  const getBrushSettings = () => {
    return {
      width: brushWidth,
      color: brushColor
    }
  }

  const setFreeDrawing = () => {
    editor.startDrawingMode('FREE_DRAWING', getBrushSettings())
    setDrawingMode('FREE_DRAWING')
  }

  const setStraightDrawing = () => {
    editor.startDrawingMode('LINE_DRAWING', getBrushSettings())
    setDrawingMode('LINE_DRAWING')
  }

  const onChangeBrushWidth = (value: number | null) => {
    if (!value) {
      return
    }

    setBrushWidth(value)

    if (activeObject) {
      updateObject({
        strokeWidth: value
      })

      return
    }

    if (drawingMode) {
      editor.stopDrawingMode()
      editor.startDrawingMode(drawingMode, {
        ...getBrushSettings(),
        width: value
      })
    }
  }

  const onChangeBrushColor = (color: ColorResult) => {
    setBrushColor(color.hex)

    if (activeObject) {
      updateObject({
        color: color.hex
      })

      return
    }

    editor.stopDrawingMode()
    editor.startDrawingMode(drawingMode, {
      ...getBrushSettings(),
      color: color.hex
    })
  }

  const updateObject = (data: Partial<tuiImageEditor.IGraphicObjectProps>) => {
    if (!activeObject || !activeObject.id) {
      return
    }

    setActiveObject({
      ...activeObject,
      ...data
    })

    editor.setObjectProperties(activeObject.id, data)
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      style={{
        width: '100%',
        height: theme.spacing(5)
      }}
    >
      <Button
        startIcon={<Icon path={mdiDraw} size={1} />}
        color={drawingMode === 'FREE_DRAWING' ? 'secondary' : 'default'}
        onClick={setFreeDrawing}
      >
        Free
      </Button>
      <Button
        startIcon={<Icon path={mdiVectorLine} size={1} />}
        color={drawingMode === 'LINE_DRAWING' ? 'secondary' : 'default'}
        onClick={setStraightDrawing}
      >
        Line
      </Button>
      <Divider orientation="vertical" className={classes.divider} />

      <ColorPicker color={brushColor} onChange={onChangeBrushColor} />
      <Divider orientation="vertical" className={classes.divider} />

      <Slider
        min={5}
        max={60}
        caption="Width"
        value={brushWidth}
        onChange={onChangeBrushWidth}
      />
    </Box>
  )
}
