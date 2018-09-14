import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Avatar from '../../../../../../components/Avatar'
import Button from '../../../../../../components/Button/IconButton'
import { ShadowLink } from '../../../../../../components/ShadowLink'
import CloseIcon from '../../../../../../components/SvgIcons/Close/CloseIcon'

import { Container, Title, Details } from './styled'

export class AssociationItem extends Component {
  static propTypes = {
    record: PropTypes.shape().isRequired,
    handleRemove: PropTypes.func.isRequired
  }

  onRemove = () => {
    this.props.handleRemove(this.props.record.id)
  }

  render() {
    const { record, removable } = this.props

    return (
      <Container>
        <Avatar {...record.avatar} />
        <div style={{ marginLeft: '0.5em' }}>
          <Title>{record.title}</Title>
          <Details>{record.details}</Details>
        </div>
        {removable && <ShadowLink href={record.url} target="_blank" />}
        {removable && (
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
