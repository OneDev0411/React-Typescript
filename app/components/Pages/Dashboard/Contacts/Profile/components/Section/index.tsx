import React, { FunctionComponent } from 'react'
import { Box, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { Menu } from './Menu'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      '& .menu__icon': {
        width: theme.spacing(2),
        height: theme.spacing(2),
        fill: theme.palette.grey[500]
      },
      '&:hover .menu__icon': {
        fill: theme.palette.common.black
      }
    },
    title: {
      fontWeight: theme.typography.fontWeightBold
    }
  })
)

interface Props {
  onEdit?: () => void
  setting?: {
    tooltip: string
    href: string
  }
  style?: React.CSSProperties
  title?: string
  titleRenderer?: () => React.ReactNode
}

export const Section: FunctionComponent<Props> = ({
  children,
  onEdit,
  setting,
  style,
  title,
  titleRenderer
}) => {
  const classes = useStyles()

  return (
    <Box className={classes.container} pb={3} pt={setting || onEdit ? 1.5 : 3}>
      <Box
        px={3}
        mb={2}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        {titleRenderer ? (
          titleRenderer()
        ) : (
          <Typography
            id={title}
            variant="body2"
            component="h3"
            className={classes.title}
          >
            {title}
          </Typography>
        )}
        <Menu onEdit={onEdit} setting={setting} />
      </Box>
      <div style={style}>{children}</div>
    </Box>
  )
}
