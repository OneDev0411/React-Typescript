import { ReactNode } from 'react'

import { Box, Typography, makeStyles } from '@material-ui/core'
import cn from 'classnames'

interface ShowingLabeledColumnProps {
  label?: string
  children: ReactNode
  alignCenter?: boolean
}

const useStyles = makeStyles(
  () => ({
    autoMargin: {
      margin: 'auto !important'
    },
    noneMargin: {
      margin: 0
    }
  }),
  { name: 'ShowingLabeledColumn' }
)

function ShowingLabeledColumn({
  label,
  children,
  alignCenter = false
}: ShowingLabeledColumnProps) {
  const classes = useStyles()

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
        className={cn(classes.noneMargin, {
          [classes.autoMargin]: alignCenter
        })}
      >
        {children}
      </Typography>
    </>
  )
}

export default ShowingLabeledColumn
