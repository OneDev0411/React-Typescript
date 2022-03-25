import { Grid, makeStyles, Theme, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column-reverse',
    alignItems: 'center',
    color: theme.palette.tertiary.light,
    [theme.breakpoints.up('md')]: {
      alignItems: 'flex-start',
      flexDirection: 'row'
    }
  },
  imageWrapper: {
    width: 56, // From figma design
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      marginRight: 0,
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(2)
    }
  },
  noteWrapper: {
    flex: 1,
    [theme.breakpoints.up('md')]: {}
  },
  title: { marginBottom: theme.spacing(2) },
  logo: {
    maxWidth: '100%'
  },
  closedNote: { marginTop: theme.spacing(2) }
}))

interface Props {
  mlsName: string
  disclaimer: string
  logo: Nullable<string>
}

export default function MLSNote({ disclaimer, mlsName, logo }: Props) {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      {logo && (
        <Grid item className={classes.imageWrapper}>
          <img className={classes.logo} src={logo} alt={mlsName} />
        </Grid>
      )}
      <Grid item className={classes.noteWrapper}>
        <Typography variant="body1" className={classes.title}>
          RLS Data display by {mlsName}
        </Typography>
        <Typography variant="body1">{disclaimer}</Typography>

        <Typography variant="body1" className={classes.closedNote}>
          Some properties which appear for sale on this website may no longer be
          available because they are under contract, have Closed or are no
          longer being offered for sale.
        </Typography>
      </Grid>
    </div>
  )
}
