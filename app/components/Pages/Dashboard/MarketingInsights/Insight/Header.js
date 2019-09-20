import React from 'react'
import PropTypes from 'prop-types'

import PageHeader from 'components/PageHeader'

import Menu from './Menu'
import { show_title } from '../List/helpers'

Header.propsType = {
  title: PropTypes.string,
  backUrl: PropTypes.string
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
        <Menu backUrl={props.backUrl} />
      </PageHeader.Menu>
    </PageHeader>
  )
}

export default Header
