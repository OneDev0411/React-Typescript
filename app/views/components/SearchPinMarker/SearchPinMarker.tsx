import React from 'react'
import { Theme, Tooltip, makeStyles } from '@material-ui/core'

import PinIcon from 'components/SvgIcons/MapPinOn/IconMapPinOn'

const useStyle = makeStyles(
  (theme: Theme) => {
    const SIZE = 5
    const POSITION = (SIZE / 2) * -1

    return {
      marker: {
        cursor: 'pointer',
        position: 'absolute',
        left: theme.spacing(POSITION),
        top: theme.spacing(POSITION),
        width: theme.spacing(SIZE),
        height: theme.spacing(SIZE)
      },
      icon: {
        width: '100% !important',
        height: '100% !important',
        fill: theme.palette.secondary.main
      }
    }
  },
  { name: 'SearchPinMarker' }
)

interface Props {
  caption: string
}

export function SearchPinMarker(props: Props) {
  const classes = useStyle()

  return (
    <div className={classes.marker}>
      <Tooltip title={props.caption}>
        <PinIcon className={classes.icon} />
      </Tooltip>
    </div>
  )
}
