import React from 'react'
import { Button } from '@material-ui/core'

import PageHeader from 'components/PageHeader'

import Menu from './Menu'
import { show_title } from '../List/helpers'

interface Props {
  title: string
  backUrl: string
  onViewEmail: () => void
}

function Header({ backUrl, onViewEmail, title = '' }: Props) {
  return (
    <PageHeader isFlat style={{ marginBottom: 0 }}>
      <PageHeader.Title showBackButton={false}>
        <PageHeader.Heading>{show_title(title)}</PageHeader.Heading>
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
