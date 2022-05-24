import React, { useState } from 'react'

import { MenuItem, Popover, useTheme } from '@material-ui/core'
import { mdiViewWeekOutline, mdiFormatListText } from '@mdi/js'
import cn from 'classnames'

import { ViewModeType } from '@app/components/Pages/Dashboard/Contacts/List/Tabs'
import { useIconStyles } from '@app/styles/use-icon-styles'
import { DropdownToggleButton } from 'components/DropdownToggleButton'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

interface IconProps {
  color: string
  className: string
}
type ListingViewProps = {
  [key in ViewModeType]: {
    label: string
    value: ViewModeType
    icon: (props: IconProps) => React.ReactNode
  }
}

const listingViewOptions: ListingViewProps = {
  table: {
    label: 'Table View',
    value: 'table',
    icon: props => <SvgIcon path={mdiFormatListText} {...props} />
  },
  board: {
    label: 'Board View',
    value: 'board',
    icon: props => <SvgIcon path={mdiViewWeekOutline} {...props} />
  }
}

interface Props {
  onChangeView: (viewMode: ViewModeType) => void
  activeView: ViewModeType
}

export const ViewSwitcher = ({ onChangeView, activeView }: Props) => {
  const theme = useTheme()
  const iconClasses = useIconStyles()

  const [viewSwitcherAnchorEl, setViewSwitcherAnchorEl] =
    useState<Element | null>(null)

  const handleViewSwitcherToggle = (event: React.MouseEvent) => {
    if (viewSwitcherAnchorEl) {
      setViewSwitcherAnchorEl(null)

      return
    }

    event && setViewSwitcherAnchorEl(event.currentTarget)
  }

  const handleViewSwitcherItemClick = (viewMode: ViewModeType) => {
    onChangeView(viewMode)
    setViewSwitcherAnchorEl(null)
  }

  return (
    <>
      <DropdownToggleButton
        component="div"
        isActive={Boolean(viewSwitcherAnchorEl)}
        onClick={handleViewSwitcherToggle}
      >
        {listingViewOptions[activeView].icon({
          color: theme.palette.text.primary,
          className: iconClasses.small
        })}
      </DropdownToggleButton>

      <Popover
        id={viewSwitcherAnchorEl ? 'view-switcher-popover' : undefined}
        open={Boolean(viewSwitcherAnchorEl)}
        anchorEl={viewSwitcherAnchorEl}
        onClose={handleViewSwitcherToggle}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        {Object.values(listingViewOptions).map(option => (
          <MenuItem
            key={option.value}
            data-view={option.value}
            selected={option.value === activeView}
            onClick={() => handleViewSwitcherItemClick(option.value)}
          >
            {option.icon({
              color: theme.palette.text.primary,
              className: cn(iconClasses.small, iconClasses.rightMargin)
            })}
            {option.label}
          </MenuItem>
        ))}
      </Popover>
    </>
  )
}
