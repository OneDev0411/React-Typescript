import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'
import addressParser from 'parse-address'
import { mdiTrashCanOutline } from '@mdi/js'

import { Tooltip } from '@material-ui/core'

import IconButton from 'components/Button/IconButton'
import ActionButton from 'components/Button/ActionButton'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import LoadSaveReinitializeForm from 'views/utils/LoadSaveReinitializeForm'

import {
  PREFIX_ITEMS,
  SUFFIX_ITEMS,
  STATES_ITEMS,
  COUNTY_ITEMS
} from './helpers/dropdown-fields-items'

import postLoadFormat from './helpers/post-load-format'

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
  preSaveFormat: PropTypes.func,
  postLoadFormat: PropTypes.func
}

const defaultProps = {
  style: {},
  validate() {},
  handleDelete() {},
  showDeleteButton: false,
  postLoadFormat
}

export class InlineAddressForm extends React.Component {
  state = {
    isDisabled: false
  }

  load = async () => {
    const { address } = this.props

    // don't parse address if it's already provided as an object
    if (address && typeof address === 'object') {
      return address
    }

    if (address) {
      try {
        this.setState({ isDisabled: true })

        const parsedAddress = await addressParser.parseLocation(address)

        this.setState({ isDisabled: false })

        return parsedAddress
      } catch (error) {
        console.log(error)
        this.setState({ isDisabled: false })
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
        postLoadFormat={this.props.postLoadFormat}
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
                    name="street_prefix"
                    label="Dir"
                    items={PREFIX_ITEMS}
                    width={15}
                  />
                  <TextField
                    width={45}
                    name="street_name"
                    label="Street Name (PO Box)"
                    hint="Please don't separate words with comma into the street name field. You can have PO Box value alongside of the street name in this format: Avondale PO Box 12 Ave"
                  />
                  <AutocompleteField
                    name="street_suffix"
                    label="Suffix"
                    items={SUFFIX_ITEMS}
                    width={20}
                  />
                </Row>
                <Row>
                  <TextField
                    name="unit_number"
                    label="Unit / Suite"
                    width={20}
                  />
                  <TextField name="city" label="City" width={20} />
                  <AutocompleteField
                    name="county"
                    label="County"
                    items={COUNTY_ITEMS}
                    width={20}
                  />
                  <AutocompleteField
                    name="state"
                    label="State"
                    items={STATES_ITEMS}
                    width={20}
                  />
                  <TextField name="postal_code" label="Zip Code" width={20} />
                </Row>
              </Body>
              <Footer>
                <Flex alignCenter>
                  {this.props.showDeleteButton && (
                    <Tooltip placement="top" title="Delete">
                      <IconButton
                        isFit
                        inverse
                        type="button"
                        disabled={isDisabled}
                        onClick={this.delete}
                      >
                        <SvgIcon path={mdiTrashCanOutline} />
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
