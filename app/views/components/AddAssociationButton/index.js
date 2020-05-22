import React from 'react'
import PropTypes from 'prop-types'
import { useField } from 'react-final-form'

import { IconButton } from '@material-ui/core'

import { AddContactAssociation } from '../AddContactAssociations'
import { AddListingAssociation } from '../AddListingAssociations'
import { AddDealAssociation } from '../AddDealAssociation'

import IconContact from '../SvgIcons/Contacts/IconContacts'
import IconListing from '../SvgIcons/Properties/IconProperties'
import IconDeal from '../SvgIcons/Deals/IconDeal'

const icons = {
  contact: IconContact,
  deal: IconDeal,
  listing: IconListing
}

AddAssociationButton.propTypes = {
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

export function AddAssociationButton(props) {
  const field = useField(props.name)

  const onAdd = (object, handleClose) => {
    const { type } = object
    const associations = field.input.value

    if (!type) {
      return
    }

    const isDuplicate = associations.some(
      association => association[type] && association[type].id === object.id
    )

    if (!isDuplicate) {
      field.input.onChange([
        ...associations,
        {
          [type]: object,
          association_type: type
        }
      ])
      handleClose()
    }
  }

  const buttonRenderer = onClick => {
    const Icon = icons[props.type]

    return (
      <IconButton
        onClick={onClick}
        disabled={props.disabled}
        style={{ marginRight: '0.5rem' }}
      >
        <Icon />
      </IconButton>
    )
  }

  const buttonProps = {
    buttonRenderer: onClick => buttonRenderer(onClick),
    disabled: props.disabled,
    handleAdd: onAdd,
    title: props.caption
  }

  switch (props.type) {
    case 'contact':
      return <AddContactAssociation {...buttonProps} />

    case 'deal':
      return <AddDealAssociation {...buttonProps} />

    case 'listing':
      return <AddListingAssociation {...buttonProps} />

    default:
      return null
  }
}
