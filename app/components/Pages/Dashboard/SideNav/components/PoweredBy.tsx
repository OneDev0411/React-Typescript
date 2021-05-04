import { Box, Grid, Divider, Typography, makeStyles } from '@material-ui/core'

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
    logo: {
      width: theme.spacing(6)
    }
  }),
  {
    name: 'SideNavPoweredBy'
  }
)

export default function PoweredBy() {
  const classes = useStyles()

  return (
    <Box>
      <Divider className={classes.divider} />
      <Grid container className={classes.container}>
        <Grid item>
          <Typography variant="caption" className={classes.text}>
            Powered by
          </Typography>
        </Grid>
        <Grid item>
          <Box pl={0.5}>
            <a href="https://rechat.com" target="_blank">
              <img
                alt="rechat"
                src="/static/images/logo--type--white.svg"
                className={classes.logo}
              />
            </a>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
