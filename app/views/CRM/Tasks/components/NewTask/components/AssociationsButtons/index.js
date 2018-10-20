import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import { AddContactAssociation } from '../../../../../../components/AddContactAssociations'
import { AddListingAssociation } from '../../../../../../components/AddListingAssociations'
import { AddDealAssociation } from '../../../../../../components/AddDealAssociation'
import Button from '../../../../../../components/Button/IconButton'
import IconContact from '../../../../../../components/SvgIcons/Contacts/IconContacts'
import IconListing from '../../../../../../components/SvgIcons/Properties/IconProperties'
import IconDeal from '../../../../../../components/SvgIcons/Deals/IconDeal'

const Container = Flex.extend`
  > div > button {
    margin-right: 1em;
  }
`

export class AssociationsButtons extends React.Component {
  onAdd = async (object = {}, handleClose) => {
    const { type } = object
    const { associations } = this.props

    if (!type) {
      return
    }

    const isDuplicate = associations.some(
      association => association[type] && association[type].id === object.id
    )

    if (!isDuplicate) {
      this.props.onClick([
        ...associations,
        {
          [type]: object,
          association_type: type
        }
      ])
      handleClose()
    }
  }

  renderButton = (onClick, Icon) => (
    <Button
      isFit
      inverse
      type="button"
      iconSize="large"
      onClick={onClick}
      disabled={this.props.disabled}
    >
      <Icon />
    </Button>
  )

  render() {
    const { disabled } = this.props

    return (
      <Container inline>
        <AddContactAssociation
          disabled={disabled}
          handleAdd={this.onAdd}
          buttonRenderer={onClick => this.renderButton(onClick, IconContact)}
        />
        <AddListingAssociation
          disabled={disabled}
          handleAdd={this.onAdd}
          buttonRenderer={onClick => this.renderButton(onClick, IconListing)}
        />
        <AddDealAssociation
          disabled={disabled}
          handleAdd={this.onAdd}
          buttonRenderer={onClick => this.renderButton(onClick, IconDeal)}
        />
      </Container>
    )
  }
}

AssociationsButtons.propTypes = {
  associations: PropTypes.arrayOf(PropTypes.shape()),
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired
}
