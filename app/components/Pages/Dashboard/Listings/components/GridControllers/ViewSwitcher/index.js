import React, { useState } from 'react'
import cn from 'classnames'
import { MenuItem } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'

import { BaseDropdown } from 'components/BaseDropdown'

import { useIconStyles } from 'styles/use-icon-styles'

import ListIcon from 'components/SvgIcons/List/ListIcon'
import GalleryIcon from 'components/SvgIcons/GalleryView/IconGalleryView'
import MapViewIcon from 'components/SvgIcons/Properties/IconProperties'

const listingViewOptions = [
  {
    label: 'Map View',
    value: 'map',
    icon: props => <MapViewIcon {...props} />
  },
  {
    label: 'Grid View',
    value: 'grid',
    icon: props => <GalleryIcon {...props} />
  },
  {
    label: 'List View',
    value: 'list',
    icon: props => <ListIcon {...props} />
  }
]
const ViewSwitcher = ({ onChangeView, activeView }) => {
  const theme = useTheme()
  const iconClasses = useIconStyles()

  const initialSelectedIndex = listingViewOptions.findIndex(
    ({ value }) => value === activeView
  )
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex)

  const handleViewSwitcherItemClick = (event, index) => {
    onChangeView(event)
    setSelectedIndex(index)
  }

  return (
    <BaseDropdown
      buttonLabel={listingViewOptions[selectedIndex].icon({
        color: theme.palette.primary,
        className: iconClasses.small
      })}
      renderMenu={({ close }) => (
        <div>
          {listingViewOptions.map((option, index) => (
            <MenuItem
              key={option.label}
              data-view={option.value}
              selected={index === selectedIndex}
              onClick={event => {
                handleViewSwitcherItemClick(event, index)
                close()
              }}
            >
              {option.icon({
                color: theme.palette.primary,
                className: cn(iconClasses.small, iconClasses.rightMargin)
              })}{' '}
              {option.label}
            </MenuItem>
          ))}
        </div>
      )}
    />
  )
}

export default ViewSwitcher
