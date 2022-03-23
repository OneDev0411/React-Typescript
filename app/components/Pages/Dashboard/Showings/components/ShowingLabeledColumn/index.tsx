import { ReactNode } from 'react'

import { Box, Typography } from '@material-ui/core'

interface ShowingLabeledColumnProps {
  label?: string
  children: ReactNode
}

function ShowingLabeledColumn({ label, children }: ShowingLabeledColumnProps) {
  return (
    <>
      {label && (
        <Typography noWrap variant="caption" component="span">
          <Box color="grey.600" component="span">
            {label}{' '}
          </Box>
        </Typography>
      )}
      <Typography variant="body2" component="span">
        {children}
      </Typography>
    </>
  )
}

export default ShowingLabeledColumn
