import { useState } from 'react'

import { Box, Typography } from '@material-ui/core'
import { CirclePicker, ColorState } from 'react-color'

import { DefaultCanvasTextProperties } from '../constants'
import { useCanvasTextContext } from '../hooks/get-canvas-text-context'

export function TextColorProperty() {
  const { label, setTextProperty, preview } = useCanvasTextContext()

  const [color, setColor] = useState<ColorState['hex']>(
    label?.textNode.fill() || DefaultCanvasTextProperties.text.fill!
  )

  const handleChangeColor = (color: ColorState) => {
    setColor(color.hex)
    setTextProperty('fill', color.hex)
    preview()
  }

  return (
    <Box my={2}>
      <Typography variant="body1" color="textSecondary">
        Text Color
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
