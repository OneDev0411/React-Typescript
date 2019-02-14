import React from 'react'
import Flex from 'styled-flex-component'

import { Checkbox } from 'components/Checkbox'
import { BasicDropdown } from 'components/BasicDropdown'
import { InlineAddressField } from 'components/inline-editable-fields/InlineAddressField'

import { Input, DropdownButton, DropdownArrowIcon } from './styled'

export class EditMode extends React.Component {
  onSubmit = values => this.props.handleSubmit(values, this.props.toggleMode)

  render() {
    const { props } = this

    return (
      <React.Fragment>
        <Flex alignCenter style={{ marginBottom: '0.25em' }}>
          <BasicDropdown
            buttonRenderer={buttonProps => (
              <DropdownButton {...buttonProps} isActive={buttonProps.isOpen}>
                {buttonProps.selectedItem.label}
                <DropdownArrowIcon isOpen={buttonProps.isOpen} />
              </DropdownButton>
            )}
            fullHeight
            items={props.labels}
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
          handleSubmit={this.onSubmit}
          preSaveFormat={props.preSaveFormat}
          postLoadFormat={props.postLoadFormat}
          renderSearchField={props => <Input {...props} type="text" />}
        />
      </React.Fragment>
    )
  }
}
