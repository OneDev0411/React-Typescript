import { Box, Grid, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%'
    },
    main: {
      display: 'flex',
      width: '100%',
      maxWidth: '457px', // From figma design
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    },
    image: {
      maxWidth: '75%',
      width: '325px', // From figma design
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

interface Props {
  image?: string
  title: string
  subtitle: string
}

export default function ListingsListEmptyState({
  image = '/static/images/zero-state/mls-explore.png',
  title,
  subtitle
}: Props) {
  const classes = useStyles()

  return (
    <Grid container className={classes.container}>
      <Box className={classes.main}>
        <img className={classes.image} src={image} alt="zero results" />
        <Box className={classes.message}>
          <Typography align="center" className={classes.title} variant="h6">
            {title}
          </Typography>
          <Typography
            align="center"
            className={classes.subtitle}
            variant="body1"
          >
            {subtitle}
          </Typography>
        </Box>
      </Box>
    </Grid>
  )
}
