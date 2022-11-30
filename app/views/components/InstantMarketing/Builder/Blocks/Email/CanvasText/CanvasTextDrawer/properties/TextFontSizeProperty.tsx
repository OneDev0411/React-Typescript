import { useState } from 'react'

import { Box, Slider, Typography } from '@material-ui/core'
import { useDebounce } from 'react-use'

import { DefaultCanvasTextProperties } from '../constants'
import { useCanvasTextContext } from '../hooks/get-canvas-text-context'

export function TextFontSizeProperty() {
  const { setTextProperty, preview } = useCanvasTextContext()

  const [fontSize, setFontSize] = useState<number>(
    DefaultCanvasTextProperties.text.fontSize!
  )
  const [debouncedFontSize, setDebouncedFontSize] = useState(fontSize)

  useDebounce(() => preview(), 200, [debouncedFontSize])

  const handleChangeFontSize = (value: number) => {
    setFontSize(value)
    setDebouncedFontSize(value)
    setTextProperty('fontSize', value)
  }

  return (
    <Box my={2}>
      <Typography variant="body1" color="textSecondary">
        Font Size
      </Typography>

      <Box mt={2}>
        <Slider
          value={fontSize}
          valueLabelDisplay="auto"
          defaultValue={fontSize}
          min={DefaultCanvasTextProperties.text.fontSize! / 2}
          max={65}
          onChange={(_, value) => handleChangeFontSize(value as number)}
        />
      </Box>
    </Box>
  )
}
