import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'
import addressParser from 'parse-address'

import Tooltip from 'components/tooltip'
import IconButton from 'components/Button/IconButton'
import ActionButton from 'components/Button/ActionButton'
import IconDelete from 'components/SvgIcons/DeleteOutline/IconDeleteOutline'
import LoadSaveReinitializeForm from 'views/utils/LoadSaveReinitializeForm'

import { postLoadFormat } from './helpers/post-load-format'
import {
  PREFIX_ITEMS,
  SUFFIX_ITEMS,
  STATES_ITEMS
} from './helpers/dropdown-fields-items'

import { Container, Body, Row, Footer } from './styled'
import { Select } from './fields/Select'
import { TextField } from './fields/TextField'
import { AutocompleteField } from './fields/AutocompleteField'

const propTypes = {
  style: PropTypes.shape(),
  validate: PropTypes.func,
  handleDelete: PropTypes.func,
  showDeleteButton: PropTypes.bool,
  handleCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  preSaveFormat: PropTypes.func.isRequired,
  postLoadFormat: PropTypes.func.isRequired
}

const defaultProps = {
  style: {},
  validate() {},
  handleDelete() {},
  showDeleteButton: false
}

export class InlineAddressForm extends React.Component {
  state = {
    error: null,
    isDisabled: false
  }

  load = async () => {
    if (this.props.address) {
      try {
        this.setState({ isDisabled: true })

        const parsedAddress = addressParser.parseLocation(this.props.address)

        this.setState({ isDisabled: false })

        return parsedAddress
      } catch (error) {
        console.log(error)
        this.setState({ isDisabled: false, error })
      }
    }

    return null
  }

  save = async address => {
    try {
      this.setState({ isDisabled: true })

      await this.props.handleSubmit(address)

      this.setState({ isDisabled: false })
    } catch (error) {
      console.log(error)
      this.setState({ isDisabled: false })
      throw error
    }
  }

  delete = async () => {
    try {
      this.setState({ isDisabled: true })

      await this.props.handleDelete()

      this.setState({ isDisabled: false })
    } catch (error) {
      console.log(error)
      this.setState({ isDisabled: false })
      throw error
    }
  }

  render() {
    const { isDisabled } = this.state

    return (
      <LoadSaveReinitializeForm
        load={this.load}
        save={this.save}
        validate={this.props.validate}
        postLoadFormat={postLoadFormat}
        preSaveFormat={this.props.preSaveFormat}
        render={formProps => (
          <Container style={this.props.style}>
            <form onSubmit={formProps.handleSubmit}>
              <Body>
                <Row>
                  <TextField
                    name="street_number"
                    label="Street Number"
                    width={20}
                  />
                  <Select
                    name="prefix"
                    label="Dir"
                    items={PREFIX_ITEMS}
                    width={15}
                  />
                  <TextField
                    name="street_name"
                    label="Street Name"
                    width={45}
                  />
                  <AutocompleteField
                    name="suffix"
                    label="Suffix"
                    items={SUFFIX_ITEMS}
                    width={20}
                  />
                </Row>
                <Row>
                  <TextField name="unit" label="Unit" width={20} />
                  <TextField name="city" label="City" width={40} />
                  <AutocompleteField
                    name="state"
                    label="State"
                    items={STATES_ITEMS}
                    width={20}
                  />
                  <TextField name="zip_code" label="Zip Code" width={20} />
                </Row>
              </Body>
              <Footer>
                <Flex alignCenter>
                  {this.props.showDeleteButton && (
                    <Tooltip placement="top" caption="Delete">
                      <IconButton
                        isFit
                        inverse
                        type="button"
                        disabled={isDisabled}
                        onClick={this.delete}
                      >
                        <IconDelete />
                      </IconButton>
                    </Tooltip>
                  )}
                </Flex>
                <Flex>
                  <ActionButton
                    type="button"
                    size="small"
                    appearance="link"
                    disabled={isDisabled}
                    onClick={this.props.handleCancel}
                  >
                    Cancel
                  </ActionButton>
                  <ActionButton
                    type="submit"
                    size="small"
                    disabled={isDisabled}
                    style={{ marginLeft: '0.5em' }}
                  >
                    {isDisabled ? 'Saving...' : 'Save'}
                  </ActionButton>
                </Flex>
              </Footer>
            </form>
          </Container>
        )}
      />
    )
  }
}

InlineAddressForm.propTypes = propTypes
InlineAddressForm.defaultProps = defaultProps
