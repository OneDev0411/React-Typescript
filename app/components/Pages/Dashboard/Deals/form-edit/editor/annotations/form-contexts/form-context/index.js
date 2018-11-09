import React from 'react'
import _ from 'underscore'

import ContextAnnotation from '../context-annotation'
import DealContext from '../../../../../../../../../models/DealContext'

function getContextType(context) {
  if (context && DealContext.isAddressField(context.name)) {
    return 'Address'
  }

  return 'Singular'
}

function getFormValue(values, annotations) {
  const valueList = annotations
    .map(ann => values[ann.fieldName])
    .filter(Boolean)

  if (valueList.length === 0) {
    return undefined
  }

  return valueList.join(' ')
}

export default function FormContexts(props) {
  const grouped = {}

  _.each(props.contexts, (data, context_name) => {
    grouped[context_name] = _.groupBy(props.contexts[context_name], 'group')
  })

  return (
    <div>
      {_.map(grouped, (groups, name) => {
        // get context
        const context = DealContext.searchContext(name)

        const contextValue = DealContext.getValue(
          props.deal,
          DealContext.searchContext(name)
        ).value

        return _.map(groups, (group, id) => {
          const annotations = group.map(i => i.annotation)
          const info = group[0]
          const { disableAutopopulate } = info

          const annotationContext = {
            type: 'Context',
            context
          }

          const contextType = getContextType(context)
          const formValue = getFormValue(props.formValues, annotations)

          const value = formValue || (disableAutopopulate ? null : contextValue)

          return (
            <ContextAnnotation
              key={`${name}-${id}`}
              annotationContext={annotationContext}
              value={value}
              maxFontSize={20}
              annotations={annotations}
              onSetValues={props.onSetValues}
              isDealConnectedToMls={props.deal.listing !== null}
              isAddressField={contextType === 'Address'}
              onClick={bounds => {
                props.onClick('Context', {
                  contextName: context.name,
                  type: contextType,
                  context,
                  annotations,
                  bounds
                })
              }}
            />
          )
        })
      })}
    </div>
  )
}
