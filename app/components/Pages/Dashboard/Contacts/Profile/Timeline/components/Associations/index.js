import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import { getAssociations } from '../../../../../../../../views/components/EventDrawer/helpers/get-associations'
import { AssociationItem } from '../../../../../../../../views/components/AssocationItem'

const propTypes = {
  // id of default association
  defaultAssociationId: PropTypes.string,
  setAssociations: PropTypes.func,
  task: PropTypes.shape().isRequired
}

const defaultProps = {
  defaultAssociationId: '',
  setAssociations: () => {}
}

export class Associations extends React.Component {
  state = {
    associations: []
  }

  componentDidMount() {
    this.fetchAssociations()
  }

  fetchAssociations = async () => {
    try {
      const associations = await getAssociations(this.props.task)

      const filteredAssociations = associations.filter(
        a => a[a.association_type].id !== this.props.defaultAssociationId
      )

      this.setState({ associations: filteredAssociations }, () =>
        this.props.setAssociations(filteredAssociations)
      )
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <Flex wrap>
        {this.state.associations.map((association, index) => (
          <AssociationItem
            association={association}
            key={`association_${index}`}
            isRemovable={false}
          />
        ))}
      </Flex>
    )
  }
}

Associations.propTypes = propTypes
Associations.defaultProps = defaultProps
