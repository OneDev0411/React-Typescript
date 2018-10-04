import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import Button from '../../../../Button/TextIconButton'
import IconDeal from '../../../../SvgIcons/Deals/IconDeal'
import IconContact from '../../../../SvgIcons/Contacts/IconContacts'
import IconListing from '../../../../SvgIcons/Properties/IconProperties'
import { AddDealAssociation } from '../../../../AddDealAssociation'
import { AddContactAssociation } from '../../../../AddContactAssociations'
import { AddListingAssociation } from '../../../../AddListingAssociations'

const Container = Flex.extend`
  margin-bottom: 1.5em;

  > div > button {
    margin-right: 1em;
  }
`

const propTypes = {
  activeButtons: PropTypes.arrayOf(PropTypes.string),
  associations: PropTypes.arrayOf(PropTypes.shape()),
  disabled: PropTypes.bool,
  handleSelect: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired
}

const defaultProps = {
  activeButtons: ['contact', 'deal', 'listing']
}

export class AssociationsButtons extends React.Component {
  renderButton = (onClick, Icon, text) => (
    <Button
      text={text}
      type="button"
      iconLeft={Icon}
      onClick={onClick}
      appearance="outline"
      disabled={this.props.disabled}
    />
  )

  render() {
    const { disabled, activeButtons } = this.props

    return (
      <Container inline>
        {activeButtons.includes('contact') && (
          <AddContactAssociation
            disabled={disabled}
            handleAdd={this.props.handleSelect}
            buttonRenderer={onClick =>
              this.renderButton(onClick, IconContact, 'Contact')
            }
          />
        )}
        {activeButtons.includes('listing') && (
          <AddListingAssociation
            disabled={disabled}
            handleAdd={this.props.handleSelect}
            buttonRenderer={onClick =>
              this.renderButton(onClick, IconListing, 'Listing')
            }
          />
        )}
        {activeButtons.includes('deal') && (
          <AddDealAssociation
            disabled={disabled}
            handleAdd={this.props.handleSelect}
            buttonRenderer={onClick =>
              this.renderButton(onClick, IconDeal, 'Deal')
            }
          />
        )}
      </Container>
    )
  }
}

AssociationsButtons.propTypes = propTypes
AssociationsButtons.defaultProps = defaultProps
