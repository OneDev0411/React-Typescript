import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import Flex from 'styled-flex-component'

import Button from '../../Button/ActionButton'
import { AssociationItem } from '../../AssocationItem'
import EmailAssociation from '../../CRMEmailAssociation'
import AssociationsDrawer from '../../AssociationsDrawer'

class List extends React.Component {
  state = {
    isOpenMoreDrawer: false
  }

  openMoreDrawer = () => this.setState({ isOpenMoreDrawer: true })

  closeMoreDrawer = () => this.setState({ isOpenMoreDrawer: false })

  removeHandler = association => {
    this.props.input.onChange(
      this.props.associations.filter(a => {
        if (association.id) {
          return a.id !== association.id
        }

        return (
          a[a.association_type].id !==
          association[association.association_type].id
        )
      })
    )
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
    const { associations } = this.props

    console.log('associations', associations)

    const associationsLength = associations.length

    if (associationsLength === 0) {
      return null
    }

    let emailAssociation
    let otherAssociations = []

    associations.forEach(association => {
      const isDefaultAssociation = this.isDefaultAssociation(association)

      // Note: disableDefaultAssociationChecking is a workaround for mini contact profile
      if (association.association_type === 'email') {
        emailAssociation = association
      } else if (isDefaultAssociation) {
        if (this.props.showDefaultAssociation) {
          otherAssociations.push(association)
        }
      } else {
        otherAssociations.push(association)
      }
    })

    const hasOtherAssociations = otherAssociations.length > 0

    return (
      <React.Fragment>
        {emailAssociation && (
          <EmailAssociation association={emailAssociation} />
        )}
        {hasOtherAssociations && (
          <Flex wrap>
            {otherAssociations.slice(0, 6).map(association => (
              <AssociationItem
                isRemovable
                key={association.id}
                association={association}
                handleRemove={this.removeHandler}
              />
            ))}
          </Flex>
        )}
        {otherAssociations.length > 6 && (
          <Button
            appearance="link"
            onClick={this.openMoreDrawer}
            size="large"
            type="button"
          >
            View All Associations
          </Button>
        )}
        {this.state.isOpenMoreDrawer && (
          <AssociationsDrawer
            isOpen
            isRemovable
            associations={otherAssociations}
            onClose={this.closeMoreDrawer}
            onDelete={this.removeHandler}
          />
        )}
      </React.Fragment>
    )
  }
}

AssociationsList.propTypes = {
  associations: PropTypes.arrayOf(PropTypes.shape()),
  defaultAssociation: PropTypes.shape(),
  name: PropTypes.string,
  showDefaultAssociation: PropTypes.bool
}

AssociationsList.defaultProps = {
  associations: [],
  name: 'associations',
  showDefaultAssociation: false
}

export function AssociationsList({
  associations = [],
  defaultAssociation = [],
  filterType,
  ...props
}) {
  const [list, defaultValues] = useMemo(() => {
    if (!filterType) {
      return [associations, defaultAssociation]
    }

    const list = associations.filter(i => i.association_type === filterType)
    const defaultValues = defaultAssociation.filter(
      i => i.association_type === filterType
    )

    return [list, defaultValues]
  }, [associations, defaultAssociation, filterType])

  return (
    <Field
      {...props}
      associations={list}
      defaultAssociation={defaultValues}
      component={List}
    />
  )
}
