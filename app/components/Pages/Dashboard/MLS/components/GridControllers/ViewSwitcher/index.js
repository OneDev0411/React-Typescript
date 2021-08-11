import React, { useState } from 'react'

import { MenuItem, Popover, useTheme } from '@material-ui/core'
import { mdiMapLegend, mdiFormatListBulleted } from '@mdi/js'
import cn from 'classnames'

import { DropdownToggleButton } from 'components/DropdownToggleButton'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { useIconStyles } from 'styles/use-icon-styles'

const listingViewOptions = [
  {
    label: 'Map View',
    value: 'map',
    icon: props => <SvgIcon path={mdiMapLegend} {...props} />
  },
  {
    label: 'List View',
    value: 'list',
    icon: props => <SvgIcon path={mdiFormatListBulleted} {...props} />
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
          color: theme.palette.text.primary,
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
            })}
            {option.label}
          </MenuItem>
        ))}
      </Popover>
    </>
  )
}

export default ViewSwitcher
