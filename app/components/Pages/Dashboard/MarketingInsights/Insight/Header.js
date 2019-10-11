import React from 'react'
import PropTypes from 'prop-types'

import PageHeader from 'components/PageHeader'
import ActionButton from 'components/Button/ActionButton'

import Menu from './Menu'
import { show_title } from '../List/helpers'

Header.propsType = {
  title: PropTypes.string,
  backUrl: PropTypes.string,
  onCloseEmail: PropTypes.func
}
Header.defaultProps = {
  title: ''
}

function Header(props) {
  return (
    <PageHeader isFlat style={{ marginBottom: 0 }}>
      <PageHeader.Title showBackButton={false}>
        <PageHeader.Heading>{show_title(props.title)}</PageHeader.Heading>
      </PageHeader.Title>
      <PageHeader.Menu>
        <ActionButton
          appearance="outline"
          style={{ marginRight: '1em' }}
          onClick={props.onCloseEmail}
        >
          View Email
        </ActionButton>
        <Menu backUrl={props.backUrl} />
      </PageHeader.Menu>
    </PageHeader>
  )
}

export default Header
