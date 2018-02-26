import React from 'react'
import { DropdownButton, MenuItem } from 'react-bootstrap'

export default function DropDown({
  options,
  disabled,
  selectedItem,
  defaultTitle,
  handleOnSelect
}) {
  return (
    <span className="contact-stages">
      <DropdownButton
        id="drp-stages"
        disabled={disabled}
        title={options[selectedItem] || defaultTitle}
        onSelect={(title, event) => {
          handleOnSelect(title)
          event.stopPropagation()
        }}
        onClick={event => {
          event.stopPropagation()
        }}
      >
        {Object.keys(options)
          .filter(item => item !== (selectedItem || defaultTitle))
          .map((item, index) => (
            <MenuItem
              key={`STAGE_${index}`}
              eventKey={item}
              className={item === selectedItem ? 'selected' : ''}
            >
              {options[item]}
            </MenuItem>
          ))}
      </DropdownButton>
    </span>
  )
}
