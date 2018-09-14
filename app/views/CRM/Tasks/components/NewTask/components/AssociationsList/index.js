import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import Flex from 'styled-flex-component'

import { AssociationItem } from '../AssocationItem'

export class AssociationsList extends React.Component {
  removeHandler = async association => {
    const { associations } = this.props

    if (association.id) {
      await this.props.handleDelete(association.id)

      return associations.filter(a => a.id !== association.id)
    }

    return associations.filter(
      a =>
        a[a.association_type].id !==
        association[association.association_type].id
    )
  }

  isRemovable = id => {
    const { defaultAssociation } = this.props

    if (!defaultAssociation) {
      return true
    }

    const { association_type } = defaultAssociation

    if (!association_type) {
      return true
    }

    const record = defaultAssociation[association_type]

    if (!record || !record.id || record.id !== id) {
      return true
    }

    return false
  }

  render() {
    return (
      <Field
        name="associations"
        render={({ input }) => (
          <Flex wrap>
            {this.props.associations.map(association => {
              if (!association || !association.association_type) {
                return null
              }

              const record = association[association.association_type]

              return (
                <AssociationItem
                  record={record}
                  key={record.id || record.title}
                  removable={this.isRemovable(record.id)}
                  handleRemove={async () => {
                    const associations = await this.removeHandler(association)

                    input.onChange(associations)
                  }}
                />
              )
            })}
          </Flex>
        )}
      />
    )
  }
}

AssociationsList.propTypes = {
  associations: PropTypes.arrayOf(PropTypes.shape()),
  handleDelete: PropTypes.func.isRequired,
  defaultAssociation: PropTypes.shape()
}

AssociationsList.defaultProps = {
  associations: []
}
