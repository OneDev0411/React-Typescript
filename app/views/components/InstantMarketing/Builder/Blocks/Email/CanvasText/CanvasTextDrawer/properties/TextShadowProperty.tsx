import { useEffect, useState } from 'react'

import {
  Box,
  makeStyles,
  Slider,
  Switch,
  Theme,
  Tooltip,
  Typography
} from '@material-ui/core'
import { CirclePicker, ColorState } from 'react-color'
import { useDebounce } from 'react-use'

import { BaseDropdown } from '@app/views/components/BaseDropdown'

import { useCanvasTextContext } from '../hooks/get-canvas-text-context'

const SLIDER_PROPERTIES = {
  x: {
    min: 0,
    max: 20,
    step: 0.5,
    label: 'Shadow Offset X'
  },
  y: {
    min: 0,
    max: 20,
    step: 0.5,
    label: 'Shadow Offset Y'
  },
  opacity: {
    min: 0,
    max: 1,
    step: 0.1,
    label: 'Shadow Opacity'
  },
  blur: {
    min: 0,
    max: 20,
    step: 0.1,
    label: 'Shadow Blur'
  }
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    dropdownButton: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer'
    },
    circle: {
      display: 'inline-block',
      width: theme.spacing(3),
      height: theme.spacing(3),
      borderRadius: '40%',
      backgroundColor: theme.palette.common.black,
      marginRight: theme.spacing(1)
    }
  }),
  {
    name: 'MarketingCenterBlocksCanvasTextPropertiesTextShadowProperty'
  }
)

export function TextShadowProperty() {
  const classes = useStyles()
  const { getTextProperty, setTextProperty, preview } = useCanvasTextContext()
  const [shadow, setShadow] = useState({
    x: getTextProperty<number>('shadowOffsetX') ?? 0,
    y: getTextProperty<number>('shadowOffsetY') ?? 0,
    fill: getTextProperty<string>('shadowColor') ?? '#000',
    opacity: getTextProperty<number>('shadowOpacity') ?? 0.1,
    blur: getTextProperty<number>('shadowBlur') ?? 0,
    disabled: !(getTextProperty<boolean>('shadowEnabled') ?? true)
  })

  const [debouncedShadow, setDebouncedShadow] = useState(shadow)

  useDebounce(
    () => {
      setDebouncedShadow(shadow)
    },
    200,
    [shadow]
  )

  useEffect(() => {
    setTextProperty('shadowEnabled', !debouncedShadow.disabled)
    setTextProperty('shadowColor', debouncedShadow.fill)
    setTextProperty('shadowOffsetX', debouncedShadow.x)
    setTextProperty('shadowOffsetY', debouncedShadow.y)
    setTextProperty('shadowOpacity', debouncedShadow.opacity)
    setTextProperty('shadowBlur', debouncedShadow.blur)

    preview()
  }, [debouncedShadow, setTextProperty, preview])

  const handleChangeProperty = (property: string, value: unknown) => {
    setShadow(state => ({
      ...state,
      [property]: value
    }))
  }

  return (
    <Box>
      <Box my={2}>
        <Typography variant="body1" color="textSecondary">
          Text Shadow
        </Typography>

        <Box mt={2}>
          <BaseDropdown
            renderDropdownButton={props => (
              <div className={classes.dropdownButton} {...props}>
                <Tooltip title="Shadow Color">
                  <span
                    className={classes.circle}
                    style={{
                      backgroundColor: shadow.fill
                    }}
                  />
                </Tooltip>
                <Tooltip title={`Shadow Opacity (${shadow.opacity})`}>
                  <span
                    className={classes.circle}
                    style={{
                      backgroundColor: shadow.fill,
                      opacity: shadow.opacity
                    }}
                  />
                </Tooltip>

                <Tooltip title={`Shadow Blur (${shadow.blur})`}>
                  <span
                    className={classes.circle}
                    style={{
                      backgroundColor: shadow.fill,
                      transform: `blur(${shadow.blur}px)`
                    }}
                  />
                </Tooltip>

                <Tooltip
                  title={`Offset X: ${shadow.x} - Offset Y: ${shadow.y}`}
                >
                  <span>
                    ({shadow.x} , {shadow.y})
                  </span>
                </Tooltip>
              </div>
            )}
            renderMenu={() => (
              <Box p={2}>
                <Box mb={2}>
                  <Typography variant="body1" color="textSecondary">
                    Text Shadow
                  </Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="caption" color="textSecondary">
                    Shadow Color
                  </Typography>
                  <Box mt={1}>
                    <CirclePicker
                      circleSize={20}
                      color={shadow.fill}
                      onChange={(color: ColorState) =>
                        handleChangeProperty('fill', color.hex)
                      }
                    />
                  </Box>
                </Box>

                {['x', 'y', 'opacity', 'blur'].map(property => (
                  <Box key={property} mb={2}>
                    <Typography variant="caption" color="textSecondary">
                      {SLIDER_PROPERTIES[property].label}
                    </Typography>

                    <Box mt={1}>
                      <Slider
                        value={shadow[property]}
                        valueLabelDisplay="auto"
                        defaultValue={shadow[property]}
                        min={SLIDER_PROPERTIES[property].min}
                        max={SLIDER_PROPERTIES[property].max}
                        step={SLIDER_PROPERTIES[property].step}
                        onChange={(_, value: number) =>
                          handleChangeProperty(property, value as number)
                        }
                      />
                    </Box>
                  </Box>
                ))}

                <Box mb={2}>
                  <Typography variant="caption" color="textSecondary">
                    Disabled
                  </Typography>
                  <Box mt={1}>
                    <Switch
                      size="small"
                      color="primary"
                      checked={shadow.disabled}
                      onChange={(_, checked: boolean) =>
                        handleChangeProperty('disabled', checked)
                      }
                    />
                  </Box>
                </Box>
              </Box>
            )}
          />
        </Box>
      </Box>
    </Box>
  )
}
