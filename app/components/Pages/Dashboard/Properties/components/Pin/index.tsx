import { memo } from 'react'

import { makeStyles } from '@material-ui/core'
import { mdiMapMarker } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  theme => ({
    pin: {
      color: theme.palette.secondary.main,
      transform: 'translate(-50%,-50%)',
      zIndex: 2,
      position: 'absolute',
      pointerEvents: 'none'
    }
  }),
  { name: 'Pin' }
)

const Pin = () => {
  const classes = useStyles()

  return (
    <SvgIcon
      path={mdiMapMarker}
      className={classes.pin}
      size={muiIconSizes.xlarge}
    />
  )
}

export default memo(Pin)
