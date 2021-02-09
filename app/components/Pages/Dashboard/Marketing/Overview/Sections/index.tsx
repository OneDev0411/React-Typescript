import React from 'react'

import { Grid } from '@material-ui/core'

import SentEmails from './SentEmailsSection'
import MyDesigns from './MyDesignsSection'

export default function Sections() {
  return (
    <Grid container item direction="column">
      <Grid container item spacing={2} direction="row" justify="space-between">
        <SentEmails />
        <MyDesigns />
      </Grid>
    </Grid>
  )
}
