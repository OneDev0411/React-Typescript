import * as React from 'react'
import { Button } from '@material-ui/core'

import PageHeader from 'components/PageHeader'

function Header(props: {
  handleCreateTemplate: () => void
}) {
  return (
    <PageHeader style={{ marginBottom: 0, marginTop: '1.5rem' }}>
      <PageHeader.Title showBackButton={false}>
        <PageHeader.Heading>Email Templates</PageHeader.Heading>
      </PageHeader.Title>
      <PageHeader.Menu>
        <Button
          color="primary"
          variant="contained"
          onClick={props.handleCreateTemplate}
        >
          Create a template
        </Button>
      </PageHeader.Menu>
    </PageHeader>
  )
}

export default Header
