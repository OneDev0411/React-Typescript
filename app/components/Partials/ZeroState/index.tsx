import { Typography, Theme, Box } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles'

interface Props {
  imageUrl: string
  title: string
  subTitle: string
  cta: React.ReactNode
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    wrapper: {
      display: 'flex',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center'
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      width: '80%',
      maxWidth: '900px'
    },
    main: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'row'
    },
    image: {
      flexBasis: '50%'
    },
    message: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexBasis: '50%'
    },
    extra: {
      flexGrow: 1
    }
  }),
  { name: 'ZeroState' }
)

export function ZeroState({ imageUrl, title, subTitle, cta }: Props) {
  const theme = useTheme<Theme>()
  const classes = useStyles()

  return (
    <Box className={classes.wrapper}>
      <Box className={classes.container}>
        <Box className={classes.main}>
          <Box className={classes.image}>
            <img src={imageUrl} alt="zero results" width="400" />
          </Box>
          <Box className={classes.message}>
            <Box>
              <Typography variant="h4">{title}</Typography>
              <Typography variant="body1">{subTitle}</Typography>
              <Box
                display="flex"
                justifyContent="space-between"
                paddingY={theme.spacing(1)}
              >
                {cta}
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className={classes.extra} />
      </Box>
    </Box>
  )
}
