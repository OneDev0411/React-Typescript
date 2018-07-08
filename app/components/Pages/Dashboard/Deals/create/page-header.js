import React from 'react'

import PageHeader from '../../../../../views/components/PageHeader'
import IconButton from '../../../../../views/components/Button/IconButton'
import CloseIcon from '../../../../../views/components/SvgIcons/Close/CloseIcon'

const Button = IconButton.extend`
  border: 1px solid #dbdbdb;
  border-radius: 4px;
  margin-right: 10px;

  :hover {
    border-color: #ccc;
  }
`

const Header = ({ title, handleOnClose }) => (
  <PageHeader>
    <PageHeader.Title showBackButton={false}>
      <Button color="#eee" hoverColor="#2196f3" onClick={handleOnClose}>
        <CloseIcon style={{ width: 32, height: 32 }} />
      </Button>

      <PageHeader.Heading>{title}</PageHeader.Heading>
    </PageHeader.Title>
  </PageHeader>
)

export default Header
