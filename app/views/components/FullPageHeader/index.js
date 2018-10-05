import React from 'react'
import PropTypes from 'prop-types'

import PageHeader from 'components/PageHeader'

FullPageHeader.propTypes = {
  ...PageHeader.propTypes,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

FullPageHeader.propTypes = PageHeader.defaultProps

export function FullPageHeader(props) {
  return (
    <PageHeader
      title={props.title}
      onClickCloseButton={props.handleClose}
      style={{
        height: 'auto',
        margin: '0 2.5rem',
        width: 'auto',
        padding: '2.5rem 0',
        ...props.style
      }}
    />
  )
}
