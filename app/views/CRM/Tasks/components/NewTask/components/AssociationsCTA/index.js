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
  static propTypes = {
    addHandler: PropTypes.func.isRequired
  }

  render() {
    return (
      <Container inline>
        <AddContactAssociation handleAdd={this.props.addHandler} />
        <AddListingAssociation handleAdd={this.props.addHandler} />
      </Container>
    )
  }
}
