import React from 'react'
import PropTypes from 'prop-types'

import { grey } from 'views/utils/colors'

import { List } from './List'
import { Section } from '../components/Section'

FlowsList.propTypes = {
  flows: PropTypes.arrayOf()
}

FlowsList.defaultProps = {
  flows: []
}

function FlowsList({ flows }) {
  return (
    <Section title="Flows" style={{ padding: '0 1.5rem' }}>
      {flows.length > 0 ? (
        <List items={flows} />
      ) : (
        <div style={{ color: grey.A900 }}>
          No flows connected to this contact.
        </div>
      )}
    </Section>
  )
}

export default FlowsList
