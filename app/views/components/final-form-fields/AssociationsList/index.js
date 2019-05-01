import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import Flex from 'styled-flex-component'

import Button from '../../Button/ActionButton'
import { AssociationItem } from '../../AssocationItem'
import EmailAssociation from '../../CRMEmailAssocation'
import AssociationsDrawer from '../../AssociationsDrawer'

class List extends React.Component {
  state = {
    isOpenMoreDrawer: false
  }

  openMoreDrawer = () => this.setState({ isOpenMoreDrawer: true })

  closeMoreDrawer = () => this.setState({ isOpenMoreDrawer: false })

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
    const { associations } = this.props
    const associationsLength = associations.length

    if (associationsLength === 0) {
      return null
    }

    let emailAssociation
    let otherAssociations = []

    associations.forEach(association => {
      const isDefaultAssociation = this.isDefaultAssociation(association)

      if (association.association_type === 'email') {
        emailAssociation = association
      } else if (!isDefaultAssociation) {
        otherAssociations.push(association)
      }
    })

    const hasOtherAssociations = otherAssociations.length > 0

    return (
      <React.Fragment>
        {emailAssociation && (
          <EmailAssociation
            association={emailAssociation}
            style={{
              marginBottom: hasOtherAssociations ? '1.5em' : 0
            }}
          />
        )}
        {hasOtherAssociations && (
          <Flex wrap style={{ marginTop: emailAssociation ? '1.5em' : '2em' }}>
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
            associations={otherAssociations}
            onClose={this.closeMoreDrawer}
          />
        )}
      </React.Fragment>
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
