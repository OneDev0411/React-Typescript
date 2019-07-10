import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Avatar from '../Avatar'
import { ShadowLink } from '../ShadowLink'
import CloseIcon from '../SvgIcons/Close/CloseIcon'

import { Container, Title, Details, RemoveButton } from './styled'
import { renderWithMiniContact } from './helpers'

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

    return (
      <Container style={this.props.style} isReadOnly={isReadOnly}>
        <Avatar {...record.avatar} />
        <div style={{ marginLeft: '0.5em' }}>
          <Title>{record.title}</Title>
          <Details>{record.details}</Details>
        </div>
        {!isReadOnly && <ShadowLink href={record.url} target="_blank" />}
        {this.props.isRemovable && (
          <RemoveButton isFit inverse type="button" onClick={this.onRemove}>
            <CloseIcon />
          </RemoveButton>
        )}
      </Container>
    )
  }
}

const AssociationItem = renderWithMiniContact(AssociationItemBase)
export { AssociationItem }
