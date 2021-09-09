import { Box, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(
  (theme: Theme) => ({
    main: {
      display: 'flex',
      height: '100%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    },
    image: {
      maxWidth: '80%',
      width: '325px',
      margin: theme.spacing(2, 0)
    },
    message: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    },
    title: { margin: theme.spacing(0.5) },
    subtitle: { margin: theme.spacing(0.5) }
  }),
  { name: 'PropertiesZeroState' }
)

export default function ZeroState() {
  const classes = useStyles()

  return (
    <Box className={classes.main}>
      <img
        className={classes.image}
        src="/static/images/zero-state/agents-network.png"
        alt="zero results"
      />
      <Box className={classes.message}>
        <Typography className={classes.title} variant="h6">
          You don't have any listings.
        </Typography>
        <Typography className={classes.subtitle} variant="body1">
          Try searching for an address or listing at the top.
        </Typography>
      </Box>
    </Box>
  )
}
