import React from 'react'
import { Typography } from '@material-ui/core'

import { List } from './List'
import { Section } from '../components/Section'

interface Props {
  contact: IContact
}

function DealsList({ contact }: Props) {
  return (
    <Section title="Deals" style={{ padding: '0 1.5rem' }}>
      {Array.isArray(contact.deals) && contact.deals.length > 0 ? (
        <List contact={contact} deals={contact.deals} />
      ) : (
        <Typography variant="body2" color="textSecondary">
          No deals connected to this contact.
        </Typography>
      )}
    </Section>
  )
}

export default DealsList
