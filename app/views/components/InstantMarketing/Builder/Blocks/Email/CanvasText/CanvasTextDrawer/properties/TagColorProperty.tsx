import { useState } from 'react'

import { Box, Typography } from '@material-ui/core'
import { CirclePicker, ColorState } from 'react-color'

import { DefaultCanvasTextProperties } from '../constants'
import { useAvailableColors } from '../hooks/use-available-colors'
import { useCanvasTextContext } from '../hooks/use-canvas-text-context'

export function TagColorProperty() {
  const { getTagProperty, templateOptions, setTagProperty, preview } =
    useCanvasTextContext()
  const colors = useAvailableColors(
    templateOptions?.textEditor?.extraColors ?? []
  )

  const [color, setColor] = useState<ColorState['hex']>(
    getTagProperty<string>('fill') ?? DefaultCanvasTextProperties.tag.fill!
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
          circleSpacing={8}
          color={color}
          colors={colors}
          onChange={handleChangeColor}
        />
      </Box>
    </Box>
  )
}
