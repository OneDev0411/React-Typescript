import classNames from 'classnames'
import { Box, makeStyles, Typography } from '@material-ui/core'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'

const useStyles = makeStyles(
  theme => ({
    image: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%'
    },
    address: {
      background:
        'linear-gradient(180deg, rgba(0, 0, 0, 0) 56.77%, #000000 100%)',
      opacity: 0,
      transition: theme.transitions.create('opacity')
    },
    icon: {
      fontSize: theme.spacing(2),
      flexShrink: 0,
      flexGrow: 0,
      marginLeft: theme.spacing(1)
    }
  }),
  {
    name: 'ShowingAppointmentCardImage'
  }
)

interface ShowingAppointmentCardImageProps {
  image: string
  address: string
  classes?: Partial<ReturnType<typeof useStyles>>
}

function ShowingAppointmentCardImage({
  image,
  address,
  classes: classesProp
}: ShowingAppointmentCardImageProps) {
  const classes = useStyles({ classes: classesProp })

  return (
    <Box position="relative" overflow="hidden">
      <Box paddingTop="54%" />
      <img className={classes.image} src={image} alt={address} />
      {address && (
        <Box
          className={classNames(classes.image, classes.address)}
          display="flex"
          alignItems="flex-end"
          color="white"
          height="100%"
          paddingX={2}
          paddingY={1}
        >
          <Box
            display="flex"
            flexDirection="row"
            width="100%"
            alignItems="center"
          >
            <Typography variant="body1" noWrap>
              {address}
            </Typography>
            <OpenInNewIcon className={classes.icon} />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default ShowingAppointmentCardImage
