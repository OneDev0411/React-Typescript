import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Avatar from '../../../../components/Avatar'
import { ShadowLink } from '../../../../components/ShadowLink'
import { Container, Title, Details, Button, RemoveIcon } from './components'

const propTypes = {
  record: PropTypes.shape().isRequired,
  handleRemove: PropTypes.func.isRequired
}

class CRMTaskAssociation extends Component {
  render() {
    const { record, handleRemove, removable } = this.props

    return (
      <Container>
        <Avatar {...record.avatar} />
        <div style={{ marginLeft: '0.5em' }}>
          <Title>{record.title}</Title>
          <Details>{record.details}</Details>
        </div>
        {removable && <ShadowLink href={record.url} target="_blank" />}
        {removable && (
          <Button type="button" onClick={() => handleRemove(record.id)}>
            <RemoveIcon />
          </Button>
        )}
      </Container>
    )
  }
}

CRMTaskAssociation.propTypes = propTypes

export default CRMTaskAssociation
