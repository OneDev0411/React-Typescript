import { useEffect, useState } from 'react'

import { Box, Slider, Typography } from '@material-ui/core'
import { useDebounce } from 'react-use'

import { useCanvasTextContext } from '../hooks/get-canvas-text-context'

export function TextLineHeightProperty() {
  const { setTextProperty, preview } = useCanvasTextContext()

  const [lineHeight, setLineHeight] = useState<number>(1)
  const [debouncedLineHeight, setDebouncedLineHeight] = useState(lineHeight)

  useDebounce(
    () => {
      setDebouncedLineHeight(lineHeight)
    },
    200,
    [lineHeight]
  )

  useEffect(() => {
    preview()
  }, [debouncedLineHeight, preview])

  const handleChangeLineHeight = (value: number) => {
    setLineHeight(value)
    setTextProperty('lineHeight', value)
  }

  return (
    <Box my={2}>
      <Typography variant="body1" color="textSecondary">
        Line Height
      </Typography>

      <Box mt={2}>
        <Slider
          value={lineHeight}
          valueLabelDisplay="auto"
          defaultValue={lineHeight}
          min={0.8}
          max={2}
          step={0.1}
          onChange={(_, value) => handleChangeLineHeight(value as number)}
        />
      </Box>
    </Box>
  )
}
