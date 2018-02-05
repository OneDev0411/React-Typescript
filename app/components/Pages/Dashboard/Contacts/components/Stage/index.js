import React from 'react'
import { DropdownButton, MenuItem } from 'react-bootstrap'

const OPTIONS = {
  Active: 'Active',
  General: 'General',
  PastClient: 'Past Client',
  QualifiedLead: 'Qualified Lead',
  UnqualifiedLead: 'Unqualified Lead'
}

export default function StageDropDown({
  selectedItem,
  defaultTitle,
  handleOnSelect
}) {
  return (
    <span className="contact-stages">
      <DropdownButton
        id="drp-stages"
        title={OPTIONS[selectedItem] || defaultTitle}
        onSelect={(title, event) => {
          handleOnSelect(title)
          event.stopPropagation()
        }}
        onClick={event => {
          event.stopPropagation()
        }}
      >
        {Object.keys(OPTIONS)
          .filter(item => item !== selectedItem)
          .map((item, index) => (
            <MenuItem
              key={`STAGE_${index}`}
              eventKey={item}
              className={item === selectedItem ? 'selected' : ''}
            >
              {OPTIONS[item]}
            </MenuItem>
          ))}
      </DropdownButton>
    </span>
  )
}
