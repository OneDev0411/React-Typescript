import React, { useState } from 'react'

import {
  Box,
  Theme,
  Button,
  Divider,
  makeStyles,
  IconButton,
  Tooltip
} from '@material-ui/core'
import { mdiDraw, mdiVectorLine, mdiHand } from '@mdi/js'
import { ColorState } from 'react-color'
import { useSelector } from 'react-redux'
import { useEffectOnce } from 'react-use'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { IAppState } from 'reducers'
import { getBrandColors } from 'utils/get-brand-colors'
import { getBrandByType } from 'utils/user-teams'

import { ColorPicker } from '../../../components/ColorPicker'
import { Slider } from '../../../components/Slider'
import { ImageEditor, Actions, DRAWING_MODE } from '../../../types'

const useStyles = makeStyles(
  (theme: Theme) => ({
    divider: {
      height: '50%',
      margin: theme.spacing(0, 2)
    },
    container: {
      width: '100%'
    },
    options: {
      height: theme.spacing(5)
    }
  }),
  {
    name: 'ImageEditorDrawActions'
  }
)

interface Props {
  editor: ImageEditor
  onChangeActiveAction: (action: Nullable<Actions>) => void
}

export function DrawActions({ editor, onChangeActiveAction }: Props) {
  const classes = useStyles()
  const [drawingMode, setDrawingMode] =
    useState<Nullable<DRAWING_MODE>>('FREE_DRAWING')

  const [activeObject, setActiveObject] =
    useState<Nullable<tuiImageEditor.IGraphicObjectProps>>(null)
  const [brushWidth, setBrushWidth] = useState(5)
  const [brushColor, setBrushColor] = useState('#000')

  const brand = useSelector<IAppState, Nullable<IBrand>>(({ activeTeam }) =>
    getBrandByType(activeTeam, 'Brokerage')
  )

  useEffectOnce(() => {
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
      editor.off('objectActivated')
    }
  })

  const toggleDrawing = () => {
    editor.stopDrawingMode()
    setDrawingMode(null)
  }

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

  const onChangeBrushColor = (color: ColorState) => {
    setBrushColor(color.hex)

    if (activeObject) {
      updateObject({
        color: color.hex
      })

      return
    }

    if (drawingMode) {
      editor.stopDrawingMode()
      editor.startDrawingMode(drawingMode, {
        ...getBrushSettings(),
        color: color.hex
      })
    }
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
      justifyContent="space-between"
      className={classes.container}
    >
      <Box
        display="flex"
        alignItems="center"
        flexGrow={1}
        className={classes.options}
      >
        <Button
          startIcon={<SvgIcon path={mdiDraw} size={muiIconSizes.medium} />}
          color={drawingMode === 'FREE_DRAWING' ? 'secondary' : 'default'}
          onClick={setFreeDrawing}
        >
          Free
        </Button>
        <Button
          startIcon={
            <SvgIcon path={mdiVectorLine} size={muiIconSizes.medium} />
          }
          color={drawingMode === 'LINE_DRAWING' ? 'secondary' : 'default'}
          onClick={setStraightDrawing}
        >
          Line
        </Button>
        <Divider orientation="vertical" className={classes.divider} />

        {brand && (
          <ColorPicker
            color={brushColor}
            colors={getBrandColors(brand)}
            onChange={onChangeBrushColor}
          />
        )}

        <Divider orientation="vertical" className={classes.divider} />

        <Slider
          min={5}
          max={60}
          caption="Width"
          value={brushWidth}
          onChange={onChangeBrushWidth}
        />
      </Box>

      <Box>
        <Tooltip title="Stop Drawing">
          <IconButton
            disabled={!drawingMode}
            color="secondary"
            onClick={toggleDrawing}
          >
            <SvgIcon path={mdiHand} size={muiIconSizes.medium} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}
