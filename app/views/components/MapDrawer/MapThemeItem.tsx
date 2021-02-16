import React from 'react'
import classNames from 'classnames'
import { ButtonBase, makeStyles, fade } from '@material-ui/core'

import config from 'config'

import { CenterPoint } from './types'

const useStyles = makeStyles(
  theme => ({
    root: {
      margin: theme.spacing(0.5),
      border: `${theme.spacing(0.5)}px solid white`,
      borderRadius: theme.shape.borderRadius,
      transition: theme.transitions.create('border-color'),
      display: 'block',
      width: '100%',
      '&:hover $name': { opacity: 1 }
    },
    space: {
      paddingTop: '100%',
      pointerEvents: 'none'
    },
    item: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none'
    },
    image: {
      objectFit: 'cover',
      border: `1px solid ${theme.palette.grey[300]}`
    },
    selected: { borderColor: theme.palette.primary.main },
    name: {
      background: fade(theme.palette.common.black, 0.65),
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0,
      transition: theme.transitions.create('opacity')
    }
  }),
  { name: 'MapThemeItem' }
)

interface MapThemeItemProps {
  selected: boolean
  onClick: () => void
  name: string
  theme: string
  center: CenterPoint
}

function MapThemeItem({
  selected,
  onClick,
  name,
  center,
  theme
}: MapThemeItemProps) {
  const classes = useStyles()

  return (
    <ButtonBase
      onClick={onClick}
      className={classNames(
        classes.root,
        selected ? classes.selected : undefined
      )}
    >
      <div className={classes.space} />
      <img
        className={classNames(classes.item, classes.image)}
        src={`https://api.mapbox.com/styles/v1/${theme}/static/${center.longitude},${center.latitude},12,0,0/200x200?access_token=${config.mapbox.access_token}&logo=false&attribution=false`}
        alt={name}
      />
      <div className={classNames(classes.item, classes.name)}>{name}</div>
    </ButtonBase>
  )
}

export default MapThemeItem
