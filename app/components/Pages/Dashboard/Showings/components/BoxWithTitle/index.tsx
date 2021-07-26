import { ReactNode } from 'react'

import { Box, Typography } from '@material-ui/core'
import { mdiArrowRight } from '@mdi/js'
import { Link } from 'react-router'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import useStyles from './styles'

interface BoxWithTitleProps {
  title: string
  children: ReactNode
  viewLink?: string
  viewTitle?: ReactNode
  marginTop?: number
  marginBottom?: number
}

function BoxWithTitle({
  title,
  children,
  viewLink,
  viewTitle,
  marginTop = 0,
  marginBottom = 5
}: BoxWithTitleProps) {
  const classes = useStyles()

  return (
    <Box mt={marginTop} mb={marginBottom}>
      <Box mb={2}>
        <Typography className={classes.title} variant="h5">
          {title}
        </Typography>
        {viewLink && (
          <Link className={classes.link} to={viewLink}>
            {viewTitle || (
              <>
                View all{' '}
                <SvgIcon path={mdiArrowRight} className={classes.icon} />
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
