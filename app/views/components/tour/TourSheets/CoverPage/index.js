import React from 'react'
import PropTypes from 'prop-types'

import { H1 } from '../../../Typography/headings'

import './style.scss'

const propTypes = {
  agent: PropTypes.shape().isRequired,
  tour: PropTypes.shape().isRequired
}

export function CoverPage(props) {
  const { agent, tour } = props

  return (
    <div className="c-tour-sheets-cover">
      <div className="c-tour-sheets__brand-line" />
      <H1>{tour.title}</H1>
    </div>
  )
}

CoverPage.propTypes = propTypes
