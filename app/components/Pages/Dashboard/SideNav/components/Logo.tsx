import { makeStyles, Theme } from '@material-ui/core'

import MainLogo from './MainLogo'

const useStyles = makeStyles(
  (theme: Theme) => ({
    logo: {
      width: '100%',
      margin: theme.spacing(1, 2, 3.5),
      [theme.breakpoints.up('md')]: {
        margin: theme.spacing(5, 2, 3.5)
      },
      maxWidth: theme.spacing(19)
    }
  }),
  { name: 'Logo' }
)

export default function Logo() {
  const classes = useStyles()

  return <MainLogo className={classes.logo} />
}
