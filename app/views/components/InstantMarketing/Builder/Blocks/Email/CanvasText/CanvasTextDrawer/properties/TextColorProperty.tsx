import { useState } from 'react'

import { Box, Typography } from '@material-ui/core'
import { CirclePicker, ColorState } from 'react-color'

import { DefaultCanvasTextProperties } from '../constants'
import { useCanvasTextContext } from '../hooks/get-canvas-text-context'
import { useAvailableColors } from '../hooks/use-available-colors'

export function TextColorProperty() {
  const { getTextProperty, setTextProperty, templateOptions, preview } =
    useCanvasTextContext()
  const colors = useAvailableColors(
    templateOptions?.textEditor?.extraColors ?? []
  )

  const [color, setColor] = useState<ColorState['hex']>(
    getTextProperty<string>('fill') ?? DefaultCanvasTextProperties.text.fill!
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
          circleSpacing={8}
          color={color}
          colors={colors}
          onChange={handleChangeColor}
        />
      </Box>
    </Box>
  )
}
