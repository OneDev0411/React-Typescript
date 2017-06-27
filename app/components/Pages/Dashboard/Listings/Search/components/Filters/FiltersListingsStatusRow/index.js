import React from 'react'
import pure from 'recompose/pure'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import Flag from './Flag'
import Dropdown from './Dropdown'
import SwitchToggle from './SwitchToggle'
import DropdownTrigger from './DropdownTrigger'

const FiltersListingsStatus = ({
  name,
  title,
  icon,
  color,
  active,
  onClickDropdown,
  dropdownIsActive,
  dropdownItems = {}
}) => {
  const hasDropdown = Object.keys(dropdownItems).length || false
  return (
    <div>
      <div className="c-filters-listings-status">
        <Flag icon={icon} color={color} />
        <span
          className="c-filters-listings-status__title"
          style={{ width: hasDropdown ? '200px' : '288px' }}>
          {title}
        </span>
        {hasDropdown &&
          <DropdownTrigger
            onClick={onClickDropdown}
            active={dropdownIsActive}
          />}
        <SwitchToggle
          name={name}
          checked={active === 'true' || false}
          className="c-filters-listings-status__switch-toggle"
        />
      </div>
      {hasDropdown &&
        <Dropdown
          name={name}
          items={dropdownItems}
          active={dropdownIsActive}
        />}
    </div>
  )
}

export default compose(
  pure,
  withState('dropdownIsActive', 'toggleDropdown', false),
  withHandlers({
    onClickDropdown: ({ dropdownIsActive, toggleDropdown }) => () => {
      toggleDropdown(!dropdownIsActive)
    }
  })
)(FiltersListingsStatus)
