import { useEffect, useState } from 'react'

import { Box, Slider, Typography } from '@material-ui/core'
import { useDebounce } from 'react-use'

import { useCanvasTextContext } from '../hooks/get-canvas-text-context'

export function TextLetterSpacingProperty() {
  const { setTextProperty, preview } = useCanvasTextContext()

  const [letterSpacing, setLetterSpacing] = useState<number>(0)
  const [debouncedLetterSpacing, setDebouncedLetterSpacing] =
    useState(letterSpacing)

  useDebounce(
    () => {
      setDebouncedLetterSpacing(letterSpacing)
    },
    200,
    [letterSpacing]
  )

  useEffect(() => {
    preview()
  }, [debouncedLetterSpacing, preview])

  const handleChangeLetterSpacing = (value: number) => {
    setLetterSpacing(value)
    setTextProperty('letterSpacing', value)
  }

  return (
    <Box my={2}>
      <Typography variant="body1" color="textSecondary">
        Text Letter Spacing
      </Typography>

      <Box mt={2}>
        <Slider
          value={letterSpacing}
          valueLabelDisplay="auto"
          defaultValue={letterSpacing}
          min={0}
          max={10}
          step={1}
          onChange={(_, value) => handleChangeLetterSpacing(value as number)}
        />
      </Box>
    </Box>
  )
}
