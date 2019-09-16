import React, { useState, useCallback } from 'react'
import { Box, IconButton, Tooltip } from '@material-ui/core'

import StopIcon from 'components/SvgIcons/CircleStop/IconCircleStop'

import { Container } from './styled'

interface Props {
  flow: TBrandFlow<'steps'>
  onStop: (flowId: UUID) => Promise<void>
}

export default function Item({ flow, onStop }: Props) {
  const [disabled, setDisabled] = useState(false)

  const handleOnStop = useCallback(async () => {
    setDisabled(true)
    await onStop(flow.id)
    setDisabled(false)
  }, [flow.id, onStop])

  return (
    <Container aria-disabled={disabled}>
      <Box className="flex-align-center" justifyContent="space-between">
        <Box className="left-side flex-align-center">
          <Box className="status flex-align-center" justifyContent="center" />
          <div className="title">{flow.name}</div>
        </Box>
        <Tooltip title="Stop this Flow">
          <IconButton onClick={handleOnStop}>
            <StopIcon className="stop-icon" />
          </IconButton>
        </Tooltip>
      </Box>
    </Container>
  )
}
