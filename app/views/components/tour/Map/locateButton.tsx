import { Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import MyLocationIcon from '@material-ui/icons/MyLocation'
import { useDispatch } from 'react-redux'

import { getLocationErrorMessage } from '@app/utils/map'
import { confirmation } from 'actions/confirmation'

const CustomizedButton = withStyles(theme => ({
  root: {
    position: 'absolute',
    zIndex: theme.zIndex.modal,
    height: 'auto',
    backgroundColor: '#fff',
    borderRadius: 2,
    boxShadow: 'rgb(0 0 0 / 30%) 0px 1px 4px -1px !important',
    left: 8,
    bottom: 32,
    minWidth: 'unset',
    padding: '6px 0',
    '& .MuiButton-startIcon': {
      margin: 0
    },
    '&:hover': {
      color: theme.palette.grey[900],
      backgroundColor: theme.palette.grey[300]
    }
  },
  label: {
    padding: '6px 12px',
    fontSize: theme.typography.button.fontSize,
    textTransform: 'capitalize',
    color: theme.palette.grey[800],
    fontWeight: theme.typography.fontWeightRegular
  }
}))(Button)

interface Props {
  onGetPosition: (lat: number, lng: number) => void
}

export const LocateButton = ({ onGetPosition }: Props) => {
  const reduxDispatch = useDispatch()

  const onClickLocate = () => {
    if (!window.navigator.geolocation) {
      return reduxDispatch(
        confirmation({
          confirmLabel: 'OK',
          message: 'Your device does not support Geolocation',
          hideCancelButton: true
        })
      )
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        onGetPosition(lat, lng)
      },
      error => {
        console.log(error)
        console.log(getLocationErrorMessage(error))
        reduxDispatch(
          confirmation({
            confirmLabel: 'OK',
            message: 'Your location is disabled',
            description:
              'Please check your browser’s setting and make sure ' +
              'your location sharing is on.',
            hideCancelButton: true
          })
        )
      },
      { timeout: 10000 }
    )
  }

  return (
    <CustomizedButton
      size="small"
      title="Get your exact location on the map"
      startIcon={<MyLocationIcon />}
      onClick={onClickLocate}
    />
  )
}
