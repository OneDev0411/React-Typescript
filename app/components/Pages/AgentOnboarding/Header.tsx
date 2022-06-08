import { Box, Typography, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import { Logo } from 'components/OAuthPageLayout/Logo'

const useStyles = makeStyles(
  (theme: Theme) => ({
    box: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      maxWidth: '40rem',
      textAlign: 'center',
      marginBottom: theme.spacing(6)
    },
    title: {
      marginBottom: theme.spacing(2)
    }
  }),
  { name: 'Header' }
)

interface Props {
  subtitle?: string
  title: string
}

export default function Header({ title, subtitle }: Props) {
  const classes = useStyles()

  return (
    <Box className={classes.box}>
      <Logo />
      <Typography variant="h4">{title}</Typography>
      <Typography variant="body1">{subtitle}</Typography>
    </Box>
  )
}
