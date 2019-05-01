import React from 'react'
import PropTypes from 'prop-types'

import { grey } from 'views/utils/colors'

import { List } from './List'
import { Section } from '../components/Section'

DealsList.propTypes = {
  contact: PropTypes.shape().isRequired
}

function DealsList({ contact }) {
  return (
    <Section title="Deals" style={{ padding: '0 1.5rem' }}>
      {Array.isArray(contact.deals) && contact.deals.length > 0 ? (
        <List contact={contact} items={contact.deals} />
      ) : (
        <div style={{ color: grey.A900 }}>
          No deals connected to this contact.
        </div>
      )}
    </Section>
  )
}

export default DealsList
