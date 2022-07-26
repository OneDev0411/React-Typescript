import { ReactNode } from 'react'

import { Box, Typography } from '@material-ui/core'

interface ShowingLabeledColumnProps {
  label?: string
  children: ReactNode
  margin?: string
}

function ShowingLabeledColumn({
  label,
  children,
  margin
}: ShowingLabeledColumnProps) {
  return (
    <>
      {label && (
        <Typography noWrap variant="caption" component="span">
          <Box color="grey.600" component="span">
            {label}{' '}
          </Box>
        </Typography>
      )}
      <Typography
        variant="body2"
        component="span"
        style={{ margin: margin || 0 }}
      >
        {children}
      </Typography>
    </>
  )
}

export default ShowingLabeledColumn
