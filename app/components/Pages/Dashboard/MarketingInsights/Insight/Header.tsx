import React from 'react'
import { Button } from '@material-ui/core'

import PageHeader from 'components/PageHeader'

import Menu from './Menu'
import { truncate_string } from '../List/helpers'

interface Props {
  title: string
  backUrl: string
  onViewEmail: () => void
}

function Header({ backUrl, onViewEmail, title = '' }: Props) {
  return (
    <PageHeader isFlat style={{ padding: '1.5em 0 0', marginBottom: 0 }}>
      <PageHeader.Title showBackButton={false}>
        <PageHeader.Heading>{truncate_string(title)}</PageHeader.Heading>
      </PageHeader.Title>
      <PageHeader.Menu>
        <Button
          variant="outlined"
          style={{ marginRight: '1em' }}
          onClick={onViewEmail}
        >
          View Email
        </Button>
        <Menu backUrl={backUrl} />
      </PageHeader.Menu>
    </PageHeader>
  )
}

export default Header
