import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'

import { IconButton } from '@material-ui/core'

import { AddContactAssociation } from '../AddContactAssociations'
import { AddListingAssociation } from '../AddListingAssociations'
import { AddDealAssociation } from '../AddDealAssociation'

import IconContact from '../SvgIcons/Contacts/IconContacts'
import IconListing from '../SvgIcons/Properties/IconProperties'
import IconDeal from '../SvgIcons/Deals/IconDeal'

class ButtonComponent extends React.Component {
  icons = {
    contact: IconContact,
    deal: IconDeal,
    listing: IconListing
  }

  onAdd = (object, handleClose) => {
    const { type } = object
    const { associations } = this.props

    if (!type) {
      return
    }

    const isDuplicate = associations.some(
      association => association[type] && association[type].id === object.id
    )

    if (!isDuplicate) {
      this.props.input.onChange([
        ...associations,
        {
          [type]: object,
          association_type: type
        }
      ])
      handleClose()
    }
  }

  buttonRenderer = onClick => {
    const Icon = this.icons[this.props.type]

    return (
      <IconButton
        onClick={onClick}
        disabled={this.props.disabled}
        style={{ marginRight: '0.5rem' }}
      >
        <Icon />
      </IconButton>
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
