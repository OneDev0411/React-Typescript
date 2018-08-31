import React, { Fragment } from 'react'
import _ from 'underscore'

import ContextAnnotation from '../context-annotation'
import Deal from '../../../../../../../../../models/Deal'

export default function FormContexts({ contexts, deal }) {
  return (
    <Fragment>
      {_.map(contexts, (context, index) => (
        <ContextAnnotation
          key={index}
          annotations={contexts[context].map(item => item.annotation)}
          value={Deal.get.field(deal, context)}
          maxFontSize={20}
        />
      ))}
    </Fragment>
  )
}
