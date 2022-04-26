import { Grid, Divider, Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    container: {
      padding: theme.spacing(1.5, 3)
    },
    divider: {
      backgroundColor: theme.palette.grey[800]
    },
    text: {
      color: theme.palette.grey[400]
    },
    linkWrapper: {
      paddingLeft: theme.spacing(0.5)
    },
    logo: {
      opacity: 0.8,
      width: theme.spacing(6),
      '&:hover': {
        opacity: 1
      }
    }
  }),
  {
    name: 'SideNavPoweredBy'
  }
)

export default function PoweredBy() {
  const classes = useStyles()

  return (
    <div>
      <Divider className={classes.divider} />
      <Grid container className={classes.container}>
        <Grid item>
          <Typography variant="caption" className={classes.text}>
            Powered by
          </Typography>
        </Grid>
        <Grid item>
          <div className={classes.linkWrapper}>
            <a href="https://rechat.com" target="_blank">
              <img
                alt="rechat"
                src="/static/images/logo--type--white.svg"
                className={classes.logo}
              />
            </a>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}
