import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import Flex from 'styled-flex-component'

import { AssociationItem } from '../../../../../../components/AssocationItem'

export class AssociationsList extends React.Component {
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
            {this.props.associations.map((association, index) => {
              if (!association || !association.association_type) {
                return null
              }

              const record = association[association.association_type]

              return (
                <AssociationItem
                  association={association}
                  key={`association_${index}`}
                  isRemovable={this.isRemovable(record.id)}
                  handleRemove={() => {
                    input.onChange(
                      this.props.associations.filter(
                        a =>
                          a[a.association_type].id !==
                          association[association.association_type].id
                      )
                    )
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
  defaultAssociation: PropTypes.shape()
}

AssociationsList.defaultProps = {
  associations: []
}
