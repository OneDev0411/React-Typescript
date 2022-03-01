import { ReactNode } from 'react'

import { Box, Typography } from '@material-ui/core'
import { Theme, makeStyles } from '@material-ui/core/styles'

interface Props {
  children?: ReactNode
  description?: string
  iconSrc: string
  title?: string
}

const styles = makeStyles(
  (theme: Theme) => ({
    description: {
      color: theme.palette.grey[500],
      marginTop: theme.spacing(2)
    },
    icon: {
      height: theme.spacing(7),
      display: 'inline-block'
    },
    title: {}
  }),
  { name: 'EmptyState' }
)

export function EmptyState({ children, description, iconSrc, title }: Props) {
  const classes = styles()

  return (
    <Box
      alignItems="flex-start"
      display="flex"
      flexDirection="column"
      padding={2}
    >
      <img alt={title || description} className={classes.icon} src={iconSrc} />
      {title && (
        <Typography className={classes.title} variant="subtitle1">
          {title}
        </Typography>
      )}
      {description && (
        <Typography className={classes.description} variant="body1">
          {description}
        </Typography>
      )}
      {children}
    </Box>
  )
}
