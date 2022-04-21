import { makeStyles, Theme } from '@material-ui/core'

import MainLogo from '@app/views/components/Logo'

const useStyles = makeStyles(
  (theme: Theme) => ({
    logo: {
      width: '100%',
      padding: theme.spacing(1, 2, 3.5),
      [theme.breakpoints.up('md')]: {
        padding: theme.spacing(5, 2, 3.5)
      }
    }
  }),
  { name: 'Logo' }
)

export default function Logo() {
  const classes = useStyles()

  return <MainLogo className={classes.logo} />
}
