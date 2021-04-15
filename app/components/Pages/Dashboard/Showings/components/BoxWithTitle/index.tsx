import { ReactNode } from 'react'
import { Box, Typography } from '@material-ui/core'

import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

import { Link } from 'react-router'

import useStyles from './styles'

interface BoxWithTitleProps {
  title: string
  children: ReactNode
  viewLink?: string
  viewTitle?: ReactNode
}

function BoxWithTitle({
  title,
  children,
  viewLink,
  viewTitle
}: BoxWithTitleProps) {
  const classes = useStyles()

  return (
    <Box mb={5}>
      <Box mb={2}>
        <Typography className={classes.title} variant="h5">
          {title}
        </Typography>
        {viewLink && (
          <Link className={classes.link} to={viewLink}>
            {viewTitle || (
              <>
                View all <ArrowForwardIcon className={classes.icon} />
              </>
            )}
          </Link>
        )}
      </Box>
      {children}
    </Box>
  )
}

export default BoxWithTitle
