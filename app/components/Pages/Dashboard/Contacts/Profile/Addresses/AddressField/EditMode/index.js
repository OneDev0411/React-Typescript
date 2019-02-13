import React from 'react'
import Flex from 'styled-flex-component'

import { Checkbox } from 'components/Checkbox'
import IconButton from 'components/Button/IconButton'
import { BasicDropdown } from 'components/BasicDropdown'
import ActionButton from 'components/Button/ActionButton'
import DeleteIcon from 'components/SvgIcons/DeleteOutline/IconDeleteOutline'
import { InlineAddressField } from 'components/inline-editable-fields/InlineAddressField'

import { postLoadFormat, preSaveFormat, getUpsertAttributes } from './helpers'

import {
  Input,
  ActionBar,
  Container,
  DropdownButton,
  DropdownArrowIcon
} from './styled'

const DEFAULT_LABEL = { label: 'Select', value: '' }

function destructuringAddress(address) {
  const { label, full_address, is_primary } = address

  return {
    is_primary,
    address: full_address,
    label: label ? { label, value: label } : DEFAULT_LABEL
  }
}

export class EditMode extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isDisabled: false,
      ...destructuringAddress(props.address)
    }

    this.labels = [
      DEFAULT_LABEL,
      ...props.address.labels.map(label => ({ label, value: label }))
    ]
  }

  onChangeLabel = label => this.setState({ label })

  onChangePrimary = () =>
    this.setState(state => ({ is_primary: !state.is_primary }))

  handleDelete = () => {
    console.log('delete from father')
  }

  handleSubmit = async values => {
    const {
      is_primary,
      label: { value: label }
    } = this.state

    const upsertList = getUpsertAttributes(
      {
        label,
        values,
        is_primary
      },
      destructuringAddress(this.props.address),
      this.props.address.attributes
    )

    if (upsertList.length > 0) {
      this.setState({ isDisabled: true })

      try {
        await this.props.handleSubmit(upsertList)

        this.props.toggleMode()
      } catch (error) {
        console.error(error)
        this.setState({ isDisabled: false })
      } finally {
      }
    }
  }

  onSubmit = () => this.handleSubmit({})

  render() {
    const { isDisabled } = this.state

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
          preSaveFormat={preSaveFormat}
          postLoadFormat={postLoadFormat}
          handleSubmit={this.handleSubmit}
          handleCancel={this.props.toggleMode}
          renderSearchField={props => <Input {...props} type="text" />}
        />
        <ActionBar>
          <IconButton isFit disabled={isDisabled}>
            <DeleteIcon />
          </IconButton>
          <Flex inline alignCenter>
            <ActionButton
              size="small"
              appearance="link"
              disabled={isDisabled}
              onClick={this.props.toggleMode}
            >
              Cancel
            </ActionButton>
            <ActionButton
              size="small"
              disabled={isDisabled}
              onClick={this.onSubmit}
            >
              {isDisabled ? 'Saving...' : 'Save'}
            </ActionButton>
          </Flex>
        </ActionBar>
      </Container>
    )
  }
}
