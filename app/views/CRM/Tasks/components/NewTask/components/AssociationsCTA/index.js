import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import { AddContactAssociation } from '../../../../../../components/AddContactAssociations'
import { AddListingAssociation } from '../../../../../../components/AddListingAssociations'
import { AddDealAssociation } from '../../../../../../components/AddDealAssociation'

const Container = Flex.extend`
  > div > button {
    margin-right: 1em;
  }
`

export class AssociationsCTA extends React.Component {
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

  render() {
    const { disabled } = this.props

    return (
      <Container inline>
        <AddContactAssociation disabled={disabled} handleAdd={this.onAdd} />
        <AddListingAssociation disabled={disabled} handleAdd={this.onAdd} />
        <AddDealAssociation disabled={disabled} handleAdd={this.onAdd} />
      </Container>
    )
  }
}

AssociationsCTA.propTypes = {
  associations: PropTypes.arrayOf(PropTypes.shape()),
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired
}
