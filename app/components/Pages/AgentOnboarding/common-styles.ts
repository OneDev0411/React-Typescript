import { makeStyles, Theme } from '@material-ui/core'

export const useCommonStyles = makeStyles((theme: Theme) => ({
  field: {
    width: '100%',
    [theme.breakpoints.up(300)]: {
      width: 280
    },
    [theme.breakpoints.up('sm')]: {
      width: 400
    },
    textAlign: 'left'
  }
}))
