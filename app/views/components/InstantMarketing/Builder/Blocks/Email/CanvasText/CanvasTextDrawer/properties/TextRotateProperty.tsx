import { useEffect, useState } from 'react'

import { Box, Slider, Typography } from '@material-ui/core'
import { useDebounce } from 'react-use'

import { useCanvasTextContext } from '../hooks/use-canvas-text-context'

export function TextRotateProperty() {
  const { textPreviewLabel, preview } = useCanvasTextContext()

  const [rotation, setRotation] = useState<number>(
    textPreviewLabel?.node.getAttr('rotation') ?? 0
  )
  const [debouncedRotation, setDebouncedRotation] = useState(rotation)

  useDebounce(
    () => {
      setDebouncedRotation(rotation)
    },
    200,
    [rotation]
  )

  useEffect(() => {
    preview()
  }, [debouncedRotation, preview])

  const handleChangeRotation = (value: number) => {
    setRotation(value)
    setDebouncedRotation(value)
    textPreviewLabel?.rotate(value)
  }

  return (
    <Box my={2}>
      <Typography variant="body1" color="textSecondary">
        Text Rotation
      </Typography>

      <Box mt={2}>
        <Slider
          value={rotation}
          valueLabelDisplay="auto"
          defaultValue={rotation}
          min={-90}
          max={90}
          onChange={(_, value) => handleChangeRotation(value as number)}
        />
      </Box>
    </Box>
  )
}
