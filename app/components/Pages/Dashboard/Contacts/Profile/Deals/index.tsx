import React from 'react'
import { Typography } from '@material-ui/core'

import { List } from './List'
import { BasicSection } from '../components/Section/Basic'

interface Props {
  contact: IContact
}

function DealsList({ contact }: Props) {
  return (
    <BasicSection title="Deals">
      {Array.isArray(contact.deals) && contact.deals.length > 0 ? (
        <List contact={contact} deals={contact.deals} />
      ) : (
        <Typography variant="body2" color="textSecondary">
          No deals connected to this contact.
        </Typography>
      )}
    </BasicSection>
  )
}

export default DealsList
