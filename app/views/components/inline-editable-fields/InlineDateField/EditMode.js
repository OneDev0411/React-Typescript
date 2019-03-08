import React from 'react'

import { DateField } from 'components/DateField'

import { Label, DropdownButton, DropdownArrowIcon } from '../styled'

export function EditMode(props) {
  return (
    <React.Fragment>
      <Label>{props.label}</Label>
      <DateField
        {...props}
        dropdownButtonRenderer={buttonProps => (
          <DropdownButton {...buttonProps} isActive={buttonProps.isOpen}>
            {buttonProps.selectedItem.label}
            <DropdownArrowIcon isOpen={buttonProps.isOpen} />
          </DropdownButton>
        )}
      />
    </React.Fragment>
  )
}
