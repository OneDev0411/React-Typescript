import React from 'react'
import _ from 'underscore'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import { normalizeAssociations } from 'views/utils/association-normalizers'

import Button from 'components/Button/ActionButton'
import { AssociationItem } from 'components/AssocationItem'
import EmailAssociation from 'components/CRMEmailAssocation'
import { getAssociations } from 'components/EventDrawer/helpers/get-associations'

import { AssociationsDrawer } from '../AssociationsDrawer'

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

    const { defaultAssociation } = props
    const { id: defaultAssociationId } = defaultAssociation[
      defaultAssociation.association_type
    ]

    this.defaultAssociationId = defaultAssociationId

    let associations = []

    if (Array.isArray(props.task.associations)) {
      associations = normalizeAssociations(props.task.associations)
    }

    this.state = {
      associations,
      isOpenMoreDrawer: false
    }
  }

  componentDidUpdate(prevProps) {
    if (this.isAssociationsGotChange(this.props.task, prevProps.task)) {
      console.log('it changes', this.props.task, prevProps.task)
      this.fetchAssociations()
    }
  }

  isAssociationsGotChange = (nextTask, currentTask) => {
    const nextTaskAssociations = this.getTaskAssociationsIds(nextTask)
    const currentTaskAssociations = this.getTaskAssociationsIds(currentTask)

    if (currentTaskAssociations.length !== nextTaskAssociations.length) {
      return true
    }

    if (
      currentTaskAssociations.length === 1 &&
      nextTaskAssociations[0] === this.defaultAssociationId &&
      currentTaskAssociations[0] === this.defaultAssociationId
    ) {
      return false
    }

    return !_.isEqual(nextTaskAssociations, currentTaskAssociations)
  }

  getTaskAssociationsIds = ({ associations }) => {
    if (Array.isArray(associations) && associations.length > 0) {
      return associations.map(a =>
        a.association_type === 'email'
          ? a.email.emails[0].email.id
          : a[a.association_type].id
      )
    }

    return []
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

  openMoreDrawer = () => this.setState({ isOpenMoreDrawer: true })

  closeMoreDrawer = () => this.setState({ isOpenMoreDrawer: false })

  render() {
    const { associations } = this.state
    const associationsLength = associations.length

    const hasOnlyDefaultAssociation = associations =>
      associations.length === 1 &&
      associations[0][associations[0].association_type].id ===
        this.defaultAssociationId

    if (associationsLength === 0 || hasOnlyDefaultAssociation(associations)) {
      return null
    }

    let emailAssociation
    let otherAssociations = []

    associations.map(a =>
      a.association_type === 'email'
        ? (emailAssociation = a)
        : otherAssociations.push(a)
    )

    const hasOtherAssociations = !hasOnlyDefaultAssociation(otherAssociations)

    return (
      <div>
        {emailAssociation && (
          <EmailAssociation
            association={emailAssociation}
            style={{
              marginTop: '1.5em',
              marginBottom: hasOtherAssociations ? 0 : '0.5em'
            }}
          />
        )}
        {hasOtherAssociations && (
          <Flex wrap style={{ marginTop: emailAssociation ? '1.5em' : '2em' }}>
            {otherAssociations
              .slice(0, 6)
              .map((association, index) =>
                this.defaultAssociationId ===
                association[association.association_type].id ? null : (
                  <AssociationItem
                    association={association}
                    key={`association_${index}`}
                    isRemovable={false}
                    isReadOnly={
                      this.defaultAssociationId ===
                      association[association.association_type].id
                    }
                  />
                )
              )}
          </Flex>
        )}
        {otherAssociations.length > 6 && (
          <Button size="large" appearance="link" onClick={this.openMoreDrawer}>
            View All Associations
          </Button>
        )}
        {this.state.isOpenMoreDrawer && (
          <AssociationsDrawer
            associations={associations}
            defaultAssociationId={this.defaultAssociationId}
            isOpen
            onClose={this.closeMoreDrawer}
          />
        )}
      </div>
    )
  }
}

Associations.propTypes = propTypes
Associations.defaultProps = defaultProps
