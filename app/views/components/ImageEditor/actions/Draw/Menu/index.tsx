import { useEffect, useState } from 'react'

import {
  Box,
  Theme,
  makeStyles,
  Button,
  Divider,
  Tooltip,
  IconButton
} from '@material-ui/core'
import { mdiDraw, mdiHand, mdiVectorLine } from '@mdi/js'
import type { EventListenerCallbackEvent } from 'pikaso'
import { ColorState } from 'react-color'
import { useSelector } from 'react-redux'

import { IAppState } from '@app/reducers'
import { getBrandColors } from '@app/utils/get-brand-colors'
import { getBrandByType } from '@app/utils/user-teams'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { ColorPicker } from '../../../components/ColorPicker'
import { Slider } from '../../../components/Slider'
import { useImageEditor } from '../../../hooks/use-image-editor'

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

export function DrawMenu() {
  const classes = useStyles()
  const { editor } = useImageEditor()

  const [drawingType, setDrawingType] =
    useState<Nullable<'pencil' | 'line'>>(null)

  const [brush, setBrush] = useState({
    color: '#000',
    width: 10
  })

  useEffect(() => {
    const onChangeActiveDrawing = ({ data }: EventListenerCallbackEvent) => {
      if (data?.type === null && drawingType !== 'pencil') {
        setDrawingType(null)
      }
    }

    editor?.on('board:change-active-drawing', onChangeActiveDrawing)

    return () => {
      editor?.off('board:change-active-drawing', onChangeActiveDrawing)
    }
  }, [editor])

  const brand = useSelector<IAppState, Nullable<IBrand>>(({ activeTeam }) =>
    getBrandByType(activeTeam, 'Brokerage')
  )

  const setBrushSize = (value: number | null) =>
    setBrush(state => ({
      ...state,
      width: value ?? 10
    }))

  const changeBrushColor = (color: ColorState) =>
    setBrush(state => ({
      ...state,
      color: color.hex
    }))

  useEffect(() => {
    editor?.shapes.pencil.stopDrawing()
    editor?.shapes.line.stopDrawing()

    if (!drawingType) {
      return
    }

    const config = {
      stroke: brush.color,
      strokeWidth: brush.width
    }

    setTimeout(() => {
      editor?.shapes[drawingType].draw(config)
    }, 50)
  }, [editor, brush.color, brush.width, drawingType])

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
          color={drawingType === 'pencil' ? 'secondary' : 'default'}
          onClick={() => setDrawingType('pencil')}
        >
          Free
        </Button>
        <Button
          startIcon={
            <SvgIcon path={mdiVectorLine} size={muiIconSizes.medium} />
          }
          color={drawingType === 'line' ? 'secondary' : 'default'}
          onClick={() => setDrawingType('line')}
        >
          Line
        </Button>
        <Divider orientation="vertical" className={classes.divider} />

        {brand && (
          <ColorPicker
            color={brush.color}
            colors={getBrandColors(brand)}
            onChange={changeBrushColor}
          />
        )}

        <Divider orientation="vertical" className={classes.divider} />

        <Slider
          min={5}
          max={60}
          caption="Width"
          value={brush.width}
          onChange={setBrushSize}
        />
      </Box>

      <Box>
        <Tooltip title="Stop Drawing">
          <span>
            <IconButton
              disabled={!drawingType}
              color="secondary"
              onClick={() => setDrawingType(null)}
            >
              <SvgIcon path={mdiHand} size={muiIconSizes.medium} />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Box>
  )
}
