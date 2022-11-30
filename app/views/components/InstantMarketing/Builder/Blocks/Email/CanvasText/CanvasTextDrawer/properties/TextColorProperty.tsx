import { useState } from 'react'

import { Box, Typography } from '@material-ui/core'
import { CirclePicker, ColorState } from 'react-color'

import { DefaultCanvasTextProperties } from '../constants'
import { useCanvasTextContext } from '../hooks/get-canvas-text-context'

export function TextColorProperty() {
  const { getTextProperty, setTextProperty, preview } = useCanvasTextContext()

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
          color={color}
          colors={[
            'transparent',
            '#f44336',
            '#e91e63',
            '#9c27b0',
            '#673ab7',
            '#3f51b5',
            '#2196f3',
            '#03a9f4',
            '#00bcd4',
            '#009688',
            '#4caf50',
            '#8bc34a',
            '#cddc39',
            '#ffeb3b',
            '#ffc107',
            '#ff9800',
            '#ff5722',
            '#795548',
            '#607d8b',
            '#000',
            '#262626',
            '#fff'
          ]}
          onChange={handleChangeColor}
        />
      </Box>
    </Box>
  )
}
