import React from 'react'
import Flex from 'styled-flex-component'

import { Checkbox } from 'components/Checkbox'
import IconButton from 'components/Button/IconButton'
import { BasicDropdown } from 'components/BasicDropdown'
import ActionButton from 'components/Button/ActionButton'
import DeleteIcon from 'components/SvgIcons/DeleteOutline/IconDeleteOutline'
import { InlineAddressField } from 'components/inline-editable-fields/InlineAddressField'

import {
  Input,
  ActionBar,
  Container,
  DropdownButton,
  DropdownArrowIcon
} from './styled'

const DEFAULT_LABEL = { label: 'Select', value: '' }

export class EditMode extends React.Component {
  constructor(props) {
    super(props)

    const {
      field: { label, full_address, is_primary }
    } = props

    this.state = {
      is_primary,
      address: full_address,
      label: label ? { label, value: label } : DEFAULT_LABEL
    }

    this.labels = [
      DEFAULT_LABEL,
      ...props.field.labels.map(label => ({ label, value: label }))
    ]
  }

  onChangeLabel = label => this.setState({ label })

  onChangePrimary = () =>
    this.setState(state => ({ is_primary: !state.is_primary }))

  handleDelete = () => {
    console.log('delete from father')
  }

  handleSubmit = async values => {
    console.log('submit from father', values)

    return null
  }

  preSaveFormat = (values, originalValues) => {
    console.log('preSaveFormat from father ', values, originalValues)

    return values
  }

  render() {
    return (
      <Container>
        <Flex alignCenter style={{ marginBottom: '0.25em' }}>
          <BasicDropdown
            fullHeight
            items={this.labels}
            onChange={this.onChangeLabel}
            selectedItem={this.state.label}
            style={{ marginRight: '1rem' }}
            buttonRenderer={buttonProps => (
              <DropdownButton {...buttonProps} isActive={buttonProps.isOpen}>
                {buttonProps.selectedItem.label}
                <DropdownArrowIcon isOpen={buttonProps.isOpen} />
              </DropdownButton>
            )}
          />
          <Checkbox
            checked={this.state.is_primary}
            onChange={this.onChangePrimary}
          >
            Primary
          </Checkbox>
        </Flex>
        <InlineAddressField
          address={this.state.address}
          handleSubmit={this.handleSubmit}
          preSaveFormat={this.preSaveFormat}
          handleCancel={this.props.toggleMode}
          renderSearchField={props => <Input {...props} type="text" />}
        />
        <ActionBar>
          <IconButton isFit>
            <DeleteIcon />
          </IconButton>
          <Flex inline alignCenter>
            <ActionButton
              appearance="link"
              size="small"
              onClick={this.props.toggleMode}
            >
              Cancel
            </ActionButton>
            <ActionButton size="small">Save</ActionButton>
          </Flex>
        </ActionBar>
      </Container>
    )
  }
}
