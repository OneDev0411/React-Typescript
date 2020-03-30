import React from 'react'
import PropTypes from 'prop-types'

import { Typography } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import { grey } from 'views/utils/colors'

import { List } from './List'
import { Section } from '../components/Section'

const useStyles = makeStyles(() =>
  createStyles({
    text: {
      color: grey.A900
    }
  })
)

DealsList.propTypes = {
  contact: PropTypes.shape().isRequired
}

function DealsList({ contact }) {
  const classes = useStyles()

  return (
    <Section title="Deals" style={{ padding: '0 1.5rem' }}>
      {Array.isArray(contact.deals) && contact.deals.length > 0 ? (
        <List contact={contact} items={contact.deals} />
      ) : (
        <Typography variant="body2" className={classes.text}>
          No deals connected to this contact.
        </Typography>
      )}
    </Section>
  )
}

export default DealsList
