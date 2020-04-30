import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { IconButton } from '@material-ui/core'

import { getNameInitials } from 'utils/helpers.js'

import { ShadowLink } from '../ShadowLink'
import CloseIcon from '../SvgIcons/Close/CloseIcon'

import {
  ProfilePhoto,
  Container,
  Title,
  Details,
  RemoveButton,
  DetailsContainer
} from './styled'
import { renderWithMiniContact } from './render-with-mini-contact'

class AssociationItemBase extends Component {
  static propTypes = {
    association: PropTypes.shape().isRequired,
    handleRemove: PropTypes.func,
    isRemovable: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    style: PropTypes.shape()
  }

  static defaultProps = {
    style: {},
    isRemovable: true,
    isReadOnly: false,
    handleRemove() {}
  }

  onRemove = () => this.props.handleRemove(this.props.association)

  render() {
    const { association, isReadOnly } = this.props

    if (!association.association_type) {
      return null
    }

    const record = association[association.association_type]
    const { avatar } = record

    return (
      <Container style={this.props.style} isReadOnly={isReadOnly}>
        <DetailsContainer>
          <ProfilePhoto
            alt={avatar.title}
            src={avatar.image || avatar.placeHolderImage}
          >
            {getNameInitials(avatar.title)}
          </ProfilePhoto>
          <div style={{ marginLeft: '0.5em' }}>
            <Title>{record.title}</Title>
            <Details>{record.details}</Details>
          </div>
        </DetailsContainer>
        {!isReadOnly && <ShadowLink href={record.url} target="_blank" />}
        {this.props.isRemovable && (
          <RemoveButton onClick={this.onRemove}>
            <IconButton>
              <CloseIcon size="small" />
            </IconButton>
          </RemoveButton>
        )}
      </Container>
    )
  }
}

const AssociationItem = renderWithMiniContact(AssociationItemBase)
export { AssociationItem }
