import React from 'react'
import _ from 'underscore'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import { getAssociations } from '../../../../../../../../views/components/EventDrawer/helpers/get-associations'
import { AssociationItem } from '../../../../../../../../views/components/AssocationItem'

const propTypes = {
  defaultAssociation: PropTypes.shape().isRequired,
  setAssociations: PropTypes.func,
  task: PropTypes.shape().isRequired
}

const defaultProps = {
  setAssociations: () => {}
}

export class Associations extends React.Component {
  constructor(props) {
    super(props)

    const { defaultAssociation } = this.props
    const { id: defaultAssociationId } = defaultAssociation[
      defaultAssociation.association_type
    ]

    this.defaultAssociationId = defaultAssociationId

    this.state = {
      associations: []
    }
  }

  componentDidMount() {
    this.fetchAssociations()
  }

  componentDidUpdate(prevProps) {
    if (!this.isAssociationsGotChange(this.props.task, prevProps.task)) {
      this.fetchAssociations()
    }
  }

  isAssociationsGotChange = (nextTask, currentTask) => {
    const nextTaskAssociations = this.getTaskAssociationsIds(nextTask)
    const currentTaskAssociations = this.getTaskAssociationsIds(currentTask)

    if (currentTaskAssociations.length === nextTaskAssociations.length) {
      if (
        currentTaskAssociations.length === 1 &&
        nextTaskAssociations[0] === this.defaultAssociationId &&
        currentTaskAssociations[0] === this.defaultAssociationId
      ) {
        return false
      }

      return _.isEqual(nextTaskAssociations, currentTaskAssociations)
    }

    return true
  }

  getTaskAssociationsIds = task => {
    const types = ['deals', 'contacts', 'listings']
    let associations = []

    types.forEach(type => {
      associations = [...associations, ...task[type]]
    })

    return associations
  }

  fetchAssociations = async () => {
    if (
      this.state.associations.length > 0 &&
      this.getTaskAssociationsIds(this.props.task).length === 0
    ) {
      return this.setState({ associations: [] })
    }

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
    const { associations } = this.state

    if (
      associations.length === 0 ||
      (associations.length === 1 &&
        associations[0][associations[0].association_type].id ===
          this.defaultAssociationId)
    ) {
      return null
    }

    return (
      <Flex wrap style={{ marginTop: '2em' }}>
        {associations.map((association, index) => (
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
