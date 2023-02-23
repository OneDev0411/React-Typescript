import { useEffect, useState } from 'react'

import { Box, Slider, Typography } from '@material-ui/core'
import { useDebounce } from 'react-use'

import { useCanvasTextContext } from '../hooks/use-canvas-text-context'

export function TextOpacityProperty() {
  const { getTextProperty, setTextProperty, preview } = useCanvasTextContext()

  const [opacity, setOpacity] = useState<number>(
    getTextProperty<number>('opacity') ?? 1
  )
  const [debouncedOpacity, setDebouncedOpacity] = useState(opacity)

  useDebounce(
    () => {
      setDebouncedOpacity(opacity)
    },
    200,
    [opacity]
  )

  useEffect(() => {
    preview()
  }, [debouncedOpacity, preview])

  const handleChangeOpacity = (value: number) => {
    setOpacity(value)
    setTextProperty('opacity', value)
  }

  return (
    <Box my={2}>
      <Typography variant="body1" color="textSecondary">
        Text Opacity
      </Typography>

      <Box mt={2}>
        <Slider
          value={opacity}
          valueLabelDisplay="auto"
          defaultValue={opacity}
          min={0.1}
          max={1}
          step={0.1}
          onChange={(_, value) => handleChangeOpacity(value as number)}
        />
      </Box>
    </Box>
  )
}
