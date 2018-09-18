import React from 'react'

import PageHeader from '../../../../../views/components/PageHeader'

const Header = ({ title, handleOnClose }) => (
  <PageHeader
    title={title}
    onClickCloseButton={handleOnClose}
    style={{
      height: 'auto',
      margin: '0 2.5rem',
      width: 'auto',
      padding: '2.5rem 0'
    }}
  />
)

export default Header
