import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import Flex from 'styled-flex-component'

import { AssociationItem } from '../../../AssocationItem'
import { AssociationsButtons } from './Buttons'

class AssociationsComponent extends React.Component {
  addHandler = async (object = {}, handleClose) => {
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

      this.props.input.onChange(nextAssociations)
      handleClose()
    }
  }

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

  isRemovable = association => {
    const { defaultAssociation } = this.props

    if (!defaultAssociation) {
      return true
    }

    const { association_type } = defaultAssociation

    if (!association_type) {
      return true
    }

    const { id: defaultAssociationId } = association[association_type]
    const { id: associationId } = defaultAssociation[association_type]

    if (
      defaultAssociationId &&
      associationId &&
      defaultAssociationId === associationId
    ) {
      return true
    }

    return false
  }

  render() {
    const { associations } = this.props

    return (
      <React.Fragment>
        <Flex>
          <AssociationsButtons
            activeButtons={this.props.activeButtons}
            onClick={this.addHandler}
            associations={associations}
            handleSelect={this.addHandler}
            disabled={this.props.disabled}
          />
        </Flex>
        <Flex wrap>
          {this.props.associations.map((association, index) => {
            if (!association || !association.association_type) {
              return null
            }

            return (
              <AssociationItem
                association={association}
                key={`association_${index}`}
                isRemovable={this.isRemovable(association)}
                handleRemove={this.removeHandler}
              />
            )
          })}
        </Flex>
      </React.Fragment>
    )
  }
}

export function Associations(props) {
  return <Field {...props} component={AssociationsComponent} />
}

Associations.propTypes = {
  activeButtons: PropTypes.arrayOf(PropTypes.string),
  associations: PropTypes.arrayOf(PropTypes.shape()),
  defaultAssociation: PropTypes.shape(),
  handleCreate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  name: PropTypes.string
}

Associations.defaultProps = {
  activeButtons: ['contact', 'deal', 'listing'],
  associations: [],
  name: 'associations'
}
