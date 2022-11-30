import { useState } from 'react'

import { Box, Typography } from '@material-ui/core'
import { CirclePicker, ColorState } from 'react-color'

import { useCanvasTextContext } from '../hooks/get-canvas-text-context'

export function TagColorProperty() {
  const { label, setTagProperty, preview } = useCanvasTextContext()

  const [color, setColor] = useState<ColorState['hex']>(
    label?.tagNode.fill() || '#fff'
  )

  const handleChangeColor = (color: ColorState) => {
    setColor(color.hex)
    setTagProperty('fill', color.hex)
    preview()
  }

  return (
    <Box my={2}>
      <Typography variant="body1" color="textSecondary">
        Background Color
      </Typography>

      <Box mt={2}>
        <CirclePicker
          width="100%"
          circleSize={20}
          color={color}
          onChange={handleChangeColor}
        />
      </Box>
    </Box>
  )
}
