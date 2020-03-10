import React, { useState } from 'react'
import cn from 'classnames'
import { MenuItem, Popover } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'

import { DropdownToggleButton } from 'components/DropdownToggleButton'

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
  const [viewSwitcherAnchorEl, setViewSwitcherAnchorEl] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex)

  const handleViewSwitcherToggle = event => {
    if (viewSwitcherAnchorEl) {
      setViewSwitcherAnchorEl(null)

      return
    }

    event && setViewSwitcherAnchorEl(event.currentTarget)
  }

  const handleViewSwitcherItemClick = (event, index) => {
    onChangeView(event)
    setSelectedIndex(index)
    setViewSwitcherAnchorEl(null)
  }

  return (
    <>
      <DropdownToggleButton
        isActive={Boolean(viewSwitcherAnchorEl)}
        onClick={handleViewSwitcherToggle}
      >
        {listingViewOptions[selectedIndex].icon({
          color: theme.palette.primary,
          className: iconClasses.small
        })}
      </DropdownToggleButton>

      <Popover
        id={viewSwitcherAnchorEl ? 'sorting-popover' : undefined}
        open={Boolean(viewSwitcherAnchorEl)}
        anchorEl={viewSwitcherAnchorEl}
        onClose={() => handleViewSwitcherToggle()}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        style={{ zIndex: 10 }}
      >
        {listingViewOptions.map((option, index) => (
          <MenuItem
            key={option.label}
            data-view={option.value}
            selected={index === selectedIndex}
            onClick={event => handleViewSwitcherItemClick(event, index)}
          >
            {option.icon({
              color: theme.palette.primary,
              className: cn(iconClasses.small, iconClasses.rightMargin)
            })}{' '}
            {option.label}
          </MenuItem>
        ))}
      </Popover>
    </>
  )
}

export default ViewSwitcher
