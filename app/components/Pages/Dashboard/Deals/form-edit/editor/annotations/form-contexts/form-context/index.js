import React from 'react'
import _ from 'underscore'

import ContextAnnotation from '../context-annotation'
import DealContext from '../../../../../../../../../models/DealContext'

function getContextType(context) {
  if (context && context.priority === 'MLS') {
    return 'Address'
  }

  return 'Singular'
}

export default function FormContexts(props) {
  return (
    <div>
      {_.map(props.contexts, (context, name) => {
        const ctx = DealContext.searchContext(name)
        const annotations = context.map(item => item.annotation)

        return (
          <ContextAnnotation
            key={name}
            value={
              DealContext.getValue(props.deal, DealContext.searchContext(name))
                .value
            }
            annotations={annotations}
            maxFontSize={20}
            onSetValues={props.onSetValues}
            onClick={bounds => {
              props.onClick('Context', {
                contextName: name,
                type: getContextType(ctx),
                context: ctx,
                annotations,
                bounds
              })
            }}
          />
        )
      })}
    </div>
  )
}
