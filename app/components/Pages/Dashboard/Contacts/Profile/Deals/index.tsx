import React from 'react'
import { Typography, makeStyles, Theme } from '@material-ui/core'

import { List } from './List'
import { BasicSection } from '../components/Section/Basic'

const useStyles = makeStyles(
  (theme: Theme) => ({
    emptyState: {
      paddingLeft: theme.spacing(1)
    }
  }),
  { name: 'ContactProfileDealsList' }
)

interface Props {
  contact: IContact
}

function DealsList({ contact }: Props) {
  const classes = useStyles()

  return (
    <BasicSection title="Deals">
      {Array.isArray(contact.deals) && contact.deals.length > 0 ? (
        <List contact={contact} deals={contact.deals} />
      ) : (
        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.emptyState}
        >
          No deals connected to this contact.
        </Typography>
      )}
    </BasicSection>
  )
}

export default DealsList
