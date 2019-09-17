import React from 'react'
import Flex from 'styled-flex-component'

import { Checkbox } from 'components/Checkbox'
import { BasicDropdown } from 'components/BasicDropdown'
import { InlineAddressField } from 'components/inline-editable-fields/InlineAddressField'

import {
  Input,
  DropdownButton,
  DropdownArrowIcon
} from 'components/inline-editable-fields/styled'

export function EditMode(props) {
  return (
    <React.Fragment>
      <Flex alignCenter style={{ marginBottom: '0.5rem' }}>
        <BasicDropdown
          buttonRenderer={buttonProps => (
            <DropdownButton {...buttonProps} isActive={buttonProps.isOpen}>
              {buttonProps.selectedItem.label}
              <DropdownArrowIcon isOpen={buttonProps.isOpen} />
            </DropdownButton>
          )}
          fullHeight
          items={props.labels}
          menuStyle={{ zIndex: 3 }}
          onChange={props.onChangeLabel}
          selectedItem={props.label}
          style={{ marginRight: '1rem' }}
        />
        <Checkbox
          checked={props.is_primary || false}
          onChange={props.onChangePrimary}
        >
          Primary
        </Checkbox>
      </Flex>
      <InlineAddressField
        address={props.address}
        handleCancel={props.toggleMode}
        handleSubmit={props.handleSubmit}
        preSaveFormat={props.preSaveFormat}
        postLoadFormat={props.postLoadFormat}
        handleInputChange={props.onChangeInput}
        renderSearchField={inputProps => (
          <Input {...inputProps} type="text" autoFocus />
        )}
      />
    </React.Fragment>
  )
}
