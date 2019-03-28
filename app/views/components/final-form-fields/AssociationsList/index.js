import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import Flex from 'styled-flex-component'

import { AssociationItem } from '../../AssocationItem'

class List extends React.Component {
  removeHandler = async association => {
    if (association.id) {
      await this.props.handleDelete(association)

      this.props.input.onChange(
        this.props.associations.filter(a => a.id !== association.id)
      )
    } else {
      this.props.input.onChange(
        this.props.associations.filter(
          a =>
            a[a.association_type].id !==
            association[association.association_type].id
        )
      )
    }
  }

  isDefaultAssociation = association => {
    const { defaultAssociation } = this.props

    if (!defaultAssociation) {
      return false
    }

    const { association_type } = defaultAssociation

    if (
      !association_type ||
      association_type !== association.association_type
    ) {
      return false
    }

    const { id: associationId } = association[association_type]
    const { id: defaultAssociationId } = defaultAssociation[association_type]

    if (
      associationId &&
      defaultAssociationId &&
      defaultAssociationId === associationId
    ) {
      return true
    }

    return false
  }

  render() {
    return (
      <Flex wrap>
        {this.props.associations.map((association, index) => {
          const isDefaultAssociation = this.isDefaultAssociation(association)

          if (
            !association ||
            !association.association_type ||
            isDefaultAssociation
          ) {
            return null
          }

          return (
            <AssociationItem
              association={association}
              key={`association_${index}`}
              handleRemove={this.removeHandler}
              isRemovable={!isDefaultAssociation}
            />
          )
        })}
      </Flex>
    )
  }
}

AssociationsList.propTypes = {
  associations: PropTypes.arrayOf(PropTypes.shape()),
  defaultAssociation: PropTypes.shape(),
  handleDelete: PropTypes.func.isRequired,
  name: PropTypes.string
}

AssociationsList.defaultProps = {
  associations: [],
  name: 'associations'
}

export function AssociationsList(props) {
  return <Field {...props} component={List} />
}
