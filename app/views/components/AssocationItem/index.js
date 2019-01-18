import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Avatar from '../Avatar'
import { ShadowLink } from '../ShadowLink'
import CloseIcon from '../SvgIcons/Close/CloseIcon'

import { Container, Title, Details, RemoveButton } from './styled'

export class AssociationItem extends Component {
  static propTypes = {
    association: PropTypes.shape().isRequired,
    handleRemove: PropTypes.func,
    isRemovable: PropTypes.bool,
    style: PropTypes.shape()
  }

  static defaultProps = {
    style: {},
    isRemovable: true,
    handleRemove() {}
  }

  onRemove = () => this.props.handleRemove(this.props.association)

  render() {
    const { association, isRemovable } = this.props

    if (!association.association_type) {
      return null
    }

    const record = association[association.association_type]

    return (
      <Container style={this.props.style}>
        <Avatar {...record.avatar} />
        <div style={{ marginLeft: '0.5em' }}>
          <Title>{record.title}</Title>
          <Details>{record.details}</Details>
        </div>
        <ShadowLink href={record.url} target="_blank" />
        {isRemovable && (
          <RemoveButton isFit inverse type="button" onClick={this.onRemove}>
            <CloseIcon />
          </RemoveButton>
        )}
      </Container>
    )
  }
}
