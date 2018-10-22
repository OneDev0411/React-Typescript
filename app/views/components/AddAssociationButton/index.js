import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'

import { createTaskAssociation } from '../../../models/tasks'

import { AddContactAssociation } from '../AddContactAssociations'
import { AddListingAssociation } from '../AddListingAssociations'
import { AddDealAssociation } from '../AddDealAssociation'
import Button from '../Button/IconButton'
import IconContact from '../SvgIcons/Contacts/IconContacts'
import IconListing from '../SvgIcons/Properties/IconProperties'
import IconDeal from '../SvgIcons/Deals/IconDeal'

class ButtonComponent extends React.Component {
  icons = {
    contact: IconContact,
    deal: IconDeal,
    listing: IconListing
  }

  create = async (crm_task, object) => {
    try {
      return await createTaskAssociation(crm_task, {
        crm_task,
        [object.type]: object.id,
        association_type: object.type
      })
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  onAdd = async (object = {}, handleClose) => {
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

      const { crm_task } = this.props

      if (crm_task) {
        const newAssociation = await this.create(crm_task, object)

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

  buttonRenderer = onClick => {
    const Icon = this.icons[this.props.type]

    return (
      <Button
        isFit
        inverse
        type="button"
        iconSize="large"
        onClick={onClick}
        disabled={this.props.disabled}
        style={{ marginRight: '1rem' }}
      >
        <Icon />
      </Button>
    )
  }

  renderButton = () => {
    const _props = {
      buttonRenderer: onClick => this.buttonRenderer(onClick),
      disabled: this.props.disabled,
      handleAdd: this.onAdd,
      title: this.props.caption
    }

    switch (this.props.type) {
      case 'contact':
        return <AddContactAssociation {..._props} />

      case 'deal':
        return <AddDealAssociation {..._props} />

      case 'listing':
        return <AddListingAssociation {..._props} />

      default:
        return null
    }
  }

  render() {
    return this.renderButton()
  }
}

export function AddAssociationButton(props) {
  return <Field {...props} component={ButtonComponent} />
}

AddAssociationButton.propTypes = {
  crm_task: PropTypes.string,
  name: PropTypes.string.isRequired,
  associations: PropTypes.arrayOf(PropTypes.shape()),
  disabled: PropTypes.bool,
  // tooltip caption
  caption: PropTypes.string,
  // Can be a [contact, dael, listing]
  type: PropTypes.string.isRequired
}

AddAssociationButton.defaultProps = {
  disabled: false,
  caption: ''
}
