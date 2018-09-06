import React, { Fragment } from 'react'
import _ from 'underscore'

import ContextAnnotation from '../context-annotation'
import DealContext from '../../../../../../../../../models/DealContext'

function getContextType(context) {
  if (context && context.priority === 'MLS') {
    return 'Address'
  }

  return 'Singular'
}

export default function FormContexts({ contexts = {}, deal, onClick }) {
  return (
    <div>
      {_.map(contexts, (context, name) => {
        const ctx = DealContext.searchContext(name)

        return (
          <ContextAnnotation
            key={name}
            value={
              DealContext.getValue(deal, DealContext.searchContext(name)).value
            }
            annotations={context.map(item => item.annotation)}
            maxFontSize={20}
            onClick={bounds => {
              onClick('Context', {
                name,
                type: getContextType(ctx),
                context: ctx,
                bounds
              })
            }}
          />
        )
      })}
    </div>
  )
}
