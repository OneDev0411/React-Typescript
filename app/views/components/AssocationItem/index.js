import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Avatar from '../Avatar'
import Button from '../Button/IconButton'
import { ShadowLink } from '../ShadowLink'
import CloseIcon from '../SvgIcons/Close/CloseIcon'

import { Container, Title, Details } from './styled'

export class AssociationItem extends Component {
  static propTypes = {
    association: PropTypes.shape().isRequired,
    isRemovable: PropTypes.bool,
    handleRemove: PropTypes.func
  }

  onRemove = () =>
    this.props.handleRemove(
      this.props.association.id,
      this.props.association.crm_task
    )

  render() {
    const { association, isRemovable } = this.props

    if (!association.association_type) {
      return null
    }

    const record = association[association.association_type]

    return (
      <Container>
        <Avatar {...record.avatar} />
        <div style={{ marginLeft: '0.5em' }}>
          <Title>{record.title}</Title>
          <Details>{record.details}</Details>
        </div>
        <ShadowLink href={record.url} target="_blank" />
        {isRemovable && (
          <Button
            isFit
            inverse
            type="button"
            iconSize="large"
            onClick={this.onRemove}
            style={{ marginLeft: '0.75em' }}
          >
            <CloseIcon />
          </Button>
        )}
      </Container>
    )
  }
}
