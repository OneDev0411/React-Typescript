import React, { Fragment } from 'react'

import Builder from './Builder'

const InstantMarketing = props => (
  <Fragment>
    {props.isOpen && (
      <Builder
        templateData={props.templateData}
        assets={props.assets}
        onSave={props.handleSave}
        onClose={props.onClose}
      />
    )}
  </Fragment>
)

export default InstantMarketing
