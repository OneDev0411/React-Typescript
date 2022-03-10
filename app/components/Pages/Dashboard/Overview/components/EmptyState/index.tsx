import { ReactNode } from 'react'

import { Box, Typography } from '@material-ui/core'
import { Theme, makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router'

interface Props {
  children?: ReactNode
  description?: string
  iconSrc: string
  moreLinkLabel?: string
  moreLinkUrl?: string
  title?: string
}

const styles = makeStyles(
  (theme: Theme) => ({
    description: {
      color: theme.palette.grey[500],
      maxWidth: '520px',
      marginTop: theme.spacing(1)
    },
    descriptionWrapper: {
      display: 'flex'
    },
    icon: {
      display: 'inline-block',
      height: theme.spacing(7),
      marginBottom: theme.spacing(1.5)
    },
    moreLinkLabel: {
      color: theme.palette.grey[500],
      borderBottom: `${theme.spacing(0.25)}px solid ${theme.palette.grey[400]}`,
      marginLeft: theme.spacing(1),
      paddingBottom: theme.spacing(0.125),

      '&:hover, &:focus': {
        color: theme.palette.primary.dark,
        borderBottom: `${theme.spacing(0.25)}px solid ${
          theme.palette.primary.dark
        }`,
        textDecoration: 'none'
      }
    },
    title: {
      marginTop: theme.spacing(1)
    }
  }),
  { name: 'EmptyState' }
)

export function EmptyState({
  children,
  description,
  iconSrc,
  moreLinkLabel,
  moreLinkUrl,
  title
}: Props) {
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
        <Box className={classes.descriptionWrapper}>
          <Typography className={classes.description} variant="body1">
            {description}
            {moreLinkUrl && (
              <Link
                className={classes.moreLinkLabel}
                target="_blank"
                to={moreLinkUrl}
              >
                {moreLinkLabel}
              </Link>
            )}
          </Typography>
        </Box>
      )}
      {children}
    </Box>
  )
}
