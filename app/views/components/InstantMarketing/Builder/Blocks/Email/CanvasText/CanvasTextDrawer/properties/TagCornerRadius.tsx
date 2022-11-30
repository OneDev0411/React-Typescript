import { useEffect, useState } from 'react'

import { Box, Slider, Typography } from '@material-ui/core'
import { useDebounce } from 'react-use'

import { useCanvasTextContext } from '../hooks/get-canvas-text-context'

export function TagCornerRadius() {
  const { getTagProperty, setTagProperty, preview } = useCanvasTextContext()

  const [radius, setRadius] = useState<number>(
    getTagProperty<number>('cornerRadius') ?? 1
  )
  const [debouncedRadius, setDebouncedRadius] = useState(radius)

  useDebounce(
    () => {
      setDebouncedRadius(radius)
    },
    200,
    [radius]
  )

  useEffect(() => {
    preview()
  }, [debouncedRadius, preview])

  const handleChangeRadius = (value: number) => {
    setRadius(value)
    setTagProperty('cornerRadius', value)
  }

  return (
    <Box my={2}>
      <Typography variant="body1" color="textSecondary">
        Background Corner Radius
      </Typography>

      <Box mt={2}>
        <Slider
          value={radius}
          valueLabelDisplay="auto"
          defaultValue={radius}
          min={0}
          max={100}
          step={1}
          onChange={(_, value) => handleChangeRadius(value as number)}
        />
      </Box>
    </Box>
  )
}
