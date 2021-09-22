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
      maxWidth: '75%',
      width: '320px',
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
  image: string
  title: string
  subtitle: string
}

export default function ZeroState({ image, title, subtitle }: Props) {
  const classes = useStyles()

  return (
    <Box className={classes.main}>
      <img className={classes.image} src={image} alt="zero results" />
      <Box className={classes.message}>
        <Typography className={classes.title} variant="h6">
          {title}
        </Typography>
        <Typography className={classes.subtitle} variant="body1">
          {subtitle}
        </Typography>
      </Box>
    </Box>
  )
}
