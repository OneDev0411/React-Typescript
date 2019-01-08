import React from 'react'

import Agent from './Agent'
import BackOffice from './BackOffice'

export default function CallToAction(props) {
  return props.isBackOffice ? <BackOffice {...props} /> : <Agent {...props} />
}
