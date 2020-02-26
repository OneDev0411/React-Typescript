import React from 'react'
import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import PageHeader from 'components/PageHeader'
import SendEmailButton from 'components/SendEmailButton'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      borderBottom: `1px solid ${theme.palette.grey.A100}`
    }
  }),
  { name: 'InboxHeader' }
)

export default function InboxHeader() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <PageHeader isFlat>
        <PageHeader.Title showBackButton={false}>
          <PageHeader.Heading>Inbox</PageHeader.Heading>
        </PageHeader.Title>
        <PageHeader.Menu>
          <SendEmailButton appearance="primary" title="Send New Email" />
        </PageHeader.Menu>
      </PageHeader>
    </div>
  )
}
