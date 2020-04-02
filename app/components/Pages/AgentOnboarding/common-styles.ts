import { createStyles, makeStyles, Theme } from '@material-ui/core'

export const useCommonStyles = makeStyles((theme: Theme) =>
  createStyles({
    field: {
      width: '100%',
      [theme.breakpoints.up(300)]: {
        width: 280
      },
      [theme.breakpoints.up('sm')]: {
        width: 400
      }
    }
  })
)
