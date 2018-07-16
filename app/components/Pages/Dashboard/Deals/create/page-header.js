import React from 'react'

import PageHeader from '../../../../../views/components/PageHeader'

const Header = ({ title, handleOnClose }) => (
  <PageHeader title={title} onClickCloseButton={handleOnClose} />
)

export default Header
