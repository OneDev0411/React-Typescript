import { makeStyles, Theme } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(
  (theme: Theme) => ({
    title: {
      marginBottom: theme.spacing(1),
      [theme.breakpoints.up('sm')]: {
        ...theme.typography.h4,
        marginBottom: theme.spacing(1)
      },
      [theme.breakpoints.up('lg')]: {
        ...theme.typography.h3,
        marginBottom: theme.spacing(2)
      }
    },
    subtitle1: {
      color: theme.palette.tertiary.light,
      [theme.breakpoints.up('sm')]: {
        ...theme.typography.h5,
        marginBottom: theme.spacing(1)
      },
      [theme.breakpoints.up('lg')]: {
        ...theme.typography.h4,
        marginBottom: theme.spacing(2)
      }
    },
    subtitle2: {
      color: theme.palette.tertiary.light,
      ...theme.typography.body2,
      [theme.breakpoints.up('sm')]: {
        ...theme.typography.body1
      },
      [theme.breakpoints.up('lg')]: {
        ...theme.typography.h5
      }
    }
  }),
  { name: 'Title' }
)

interface Props {
  title?: string
  subtitle1?: string
  subtitle2?: string
}

function Title({ title, subtitle1, subtitle2 }: Props) {
  const classes = useStyles()

  return (
    <>
      <Typography color="primary" variant="h5" className={classes.title}>
        {title}
      </Typography>
      <Typography variant="h6" className={classes.subtitle1}>
        {subtitle1}
      </Typography>
      <Typography variant="caption" className={classes.subtitle2}>
        {subtitle2}
      </Typography>
    </>
  )
}

export default Title
