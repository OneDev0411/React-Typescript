import { Box, Typography } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'

import GlobalPageLayout from '@app/views/components/GlobalPageLayout'

const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
      [theme.breakpoints.up('md')]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start'
      }
    },
    subtitle: {
      color: theme.palette.grey['400'],
      [theme.breakpoints.up('md')]: {
        marginLeft: theme.spacing(2)
      }
    }
  })
)

interface Props {
  title: string
  subtitle?: string
}

export function Header({ subtitle, title }: Props) {
  const classes = useStyles()

  return (
    <Box className={classes.container}>
      <GlobalPageLayout.Header title={title} isHiddenOnMobile={false}>
        <Typography variant="h6" className={classes.subtitle}>
          {subtitle}
        </Typography>
      </GlobalPageLayout.Header>
    </Box>
  )
}
