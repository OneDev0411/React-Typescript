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
import { mdiDraw, mdiVectorLine, mdiCheckOutline, mdiCancel } from '@mdi/js'

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
  const [brushWidth, setBrushWidth] = useState(5)
  const [brushColor, setBrushColor] = useState('#000')

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
    if (!value || Number(value) < 5 || Number(value) > 30) {
      return
    }

    setBrushWidth(value)

    editor.stopDrawingMode()
    editor.startDrawingMode(drawingMode, {
      ...getBrushSettings(),
      width: value
    })
  }

  const onChangeBrushColor = (color: ColorResult) => {
    setBrushColor(color.hex)

    // setBrush color not working when changing drawing mode
    editor.stopDrawingMode()
    editor.startDrawingMode(drawingMode, {
      ...getBrushSettings(),
      color: color.hex
    })
  }

  const apply = () => editor.stopDrawingMode()
  const cancel = () => {
    editor.stopDrawingMode()
    onChangeActiveAction(null)
  }

  return (
    <Box display="flex" alignItems="center" width="100%">
      <Box
        display="flex"
        alignItems="center"
        flexGrow={1}
        style={{
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
          max={30}
          caption="Width"
          value={brushWidth}
          onChange={onChangeBrushWidth}
        />
      </Box>

      <div>
        <Button
          startIcon={<Icon path={mdiCancel} size={0.75} />}
          size="small"
          onClick={cancel}
        >
          Cancel
        </Button>

        <Button
          startIcon={<Icon path={mdiCheckOutline} size={0.75} />}
          size="small"
          onClick={apply}
        >
          Stop Drawing
        </Button>
      </div>
    </Box>
  )
}
