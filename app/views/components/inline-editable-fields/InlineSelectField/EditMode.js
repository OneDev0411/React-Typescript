import React from 'react'

import { BasicDropdown } from 'components/BasicDropdown'

import { Label, DropdownButton, DropdownArrowIcon } from '../styled'

export function EditMode(props) {
  return (
    <React.Fragment>
      <Label>{props.label}</Label>
      <BasicDropdown
        buttonRenderer={buttonProps => (
          <DropdownButton {...buttonProps} isActive={buttonProps.isOpen}>
            {buttonProps.selectedItem.label}
            <DropdownArrowIcon isOpen={buttonProps.isOpen} />
          </DropdownButton>
        )}
        fullHeight
        items={props.items}
        onChange={props.onChange}
        selectedItem={props.selectedItem}
      />
    </React.Fragment>
  )
}
