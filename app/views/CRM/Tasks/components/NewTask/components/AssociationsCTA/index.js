import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import { AddContactAssociation } from '../../../../../../components/AddContactAssociations'
import { AddListingAssociation } from '../../../../../../components/AddListingAssociations'

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
      let nextAssociations

      const newAssociation = await this.props.handleCreate({
        [type]: object.id,
        association_type: type
      })

      if (newAssociation) {
        nextAssociations = [
          ...associations,
          {
            ...newAssociation,
            [type]: object
          }
        ]
      } else {
        nextAssociations = [
          ...associations,
          {
            [type]: object,
            association_type: type
          }
        ]
      }

      this.props.onChange(nextAssociations)
      handleClose()
    }
  }

  render() {
    return (
      <Container inline>
        <AddContactAssociation handleAdd={this.onAdd} />
        <AddListingAssociation handleAdd={this.onAdd} />
      </Container>
    )
  }
}

AssociationsCTA.propTypes = {
  associations: PropTypes.arrayOf(PropTypes.shape()),
  onChange: PropTypes.func.isRequired,
  handleCreate: PropTypes.func.isRequired
}
