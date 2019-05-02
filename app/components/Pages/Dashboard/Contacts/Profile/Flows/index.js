import React from 'react'
import PropTypes from 'prop-types'

import { grey } from 'views/utils/colors'

import { List } from './List'
import { Section } from '../components/Section'

FlowsList.propTypes = {
  flows: PropTypes.arrayOf(),
  onStop: PropTypes.func.isRequired
}

FlowsList.defaultProps = {
  flows: []
}

function FlowsList({ flows, onStop }) {
  return (
    <Section title="Flows" style={{ padding: '0 1.5rem' }}>
      {Array.isArray(flows) && flows.length > 0 ? (
        <List items={flows} onStop={onStop} />
      ) : (
        <div style={{ color: grey.A900 }}>
          No flows connected to this contact.
        </div>
      )}
    </Section>
  )
}

export default FlowsList
