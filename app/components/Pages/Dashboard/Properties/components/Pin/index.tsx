import { memo } from 'react'

import { makeStyles } from '@material-ui/core'
import { mdiMapMarker } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  theme => ({
    pin: {
      color: theme.palette.secondary.main,
      transform: 'translate(-50%,-90%)',
      zIndex: 2,
      position: 'absolute',
      pointerEvents: 'none'
    }
  }),
  { name: 'Pin' }
)

interface Props {
  lat: number
  lng: number
}

const Pin = (props: Props) => {
  const classes = useStyles()

  return (
    <SvgIcon
      data-lat={props.lat}
      data-lng={props.lng}
      path={mdiMapMarker}
      className={classes.pin}
      size={muiIconSizes.xlarge}
    />
  )
}

export default memo(Pin)
