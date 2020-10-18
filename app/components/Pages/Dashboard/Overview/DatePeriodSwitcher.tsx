import React from 'react'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Box from '@material-ui/core/Box'
import styled from 'styled-components'

const StyledButtonGroup = styled(ButtonGroup)`
  .MuiButton-root.Mui-disabled {
    color: rgba(107, 131, 178, 0.46);
  }
  .MuiButton-outlined {
    border-color: rgba(0, 0, 0, 0.53);

    &.Mui-disabled {
      border-color: rgba(107, 131, 178, 0.42);
    }
  }
`

export default function DatePeriodSwitcher() {
    return (
        <Box display="flex" justifyContent="flex-end" mb={6}>
            <StyledButtonGroup aria-label="overview-period">
                <Button disabled>Week</Button>
                <Button disabled>Month</Button>
                <Button>YTD</Button>
            </StyledButtonGroup>
        </Box>
    )
}
