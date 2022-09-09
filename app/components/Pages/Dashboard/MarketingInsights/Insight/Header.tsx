import React from 'react'

import { Button } from '@material-ui/core'

import { TextMiddleTruncate } from '@app/views/components/TextMiddleTruncate'
import PageHeader from 'components/PageHeader'

import Menu from './Menu'

interface Props {
  title: string
  backUrl: string
  viewEmailDisabled?: boolean
  onViewEmail: () => void
}

function Header({
  backUrl,
  viewEmailDisabled,
  onViewEmail,
  title = ''
}: Props) {
  return (
    <PageHeader isFlat style={{ padding: '1.5em 0 0', marginBottom: 0 }}>
      <PageHeader.Title showBackButton={false}>
        <PageHeader.Heading>
          <TextMiddleTruncate text={title} maxLength={80} />
        </PageHeader.Heading>
      </PageHeader.Title>
      <PageHeader.Menu>
        <Button
          variant="outlined"
          style={{ marginRight: '1em' }}
          disabled={viewEmailDisabled}
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
