import { useEffect, useState } from 'react'

import { Box, Slider, Typography } from '@material-ui/core'
import { useDebounce } from 'react-use'

import { DefaultCanvasTextProperties } from '../constants'
import { useCanvasTextContext } from '../hooks/get-canvas-text-context'

export function TextPaddingProperty() {
  const { setTextProperty, preview } = useCanvasTextContext()

  const [padding, setPadding] = useState<number>(
    DefaultCanvasTextProperties.text.padding!
  )
  const [debouncedPadding, setDebouncedPadding] = useState(padding)

  useDebounce(
    () => {
      setDebouncedPadding(padding)
    },
    200,
    [padding]
  )

  useEffect(() => {
    preview()
  }, [debouncedPadding, preview])

  const handleChangePadding = (value: number) => {
    setPadding(value)
    setTextProperty('padding', value)
  }

  return (
    <Box my={2}>
      <Typography variant="body1" color="textSecondary">
        Padding
      </Typography>

      <Box mt={2}>
        <Slider
          value={padding}
          valueLabelDisplay="auto"
          defaultValue={padding}
          min={0}
          max={50}
          step={1}
          onChange={(_, value) => handleChangePadding(value as number)}
        />
      </Box>
    </Box>
  )
}
