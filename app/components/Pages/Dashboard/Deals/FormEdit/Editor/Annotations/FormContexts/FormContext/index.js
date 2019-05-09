import React, { Fragment, useState, useEffect } from 'react'
import _ from 'underscore'

import DealContext from 'models/Deal/helpers/dynamic-context'
import { InlineAddressField } from 'components/inline-editable-fields/InlineAddressField'

import { upsertContexts } from 'actions/deals'

import store from '../../../../../../../../../stores'

import { getAnnotationsValues } from '../../../../utils/word-wrap'

import ContextAnnotation from '../ContextAnnotation'

export function FormContext(props) {
  const [contexts, setContexts] = useState([])

  const handleSaveAddress = async address => {
    console.log(address)
    store.dispatch(upsertContexts(props.deal, address))
  }

  useEffect(() => {
    const grouped = {}
    const contexts = []
    let defaultValues = {}

    _.each(props.contexts, (data, context_name) => {
      grouped[context_name] = _.groupBy(props.contexts[context_name], 'group')
    })

    _.each(grouped, (groups, name) => {
      const context = DealContext.searchContext(props.deal.brand.id, name)

      const contextValue = context
        ? DealContext.getValue(props.deal, context).value
        : ''

      _.each(groups, (group, id) => {
        const annotations = group.map(item => item.annotation)
        const contextType = getContextType(context)
        const formValue = getFormValue(props.formValues, annotations)

        const value =
          formValue || (group[0].disableAutopopulate ? null : contextValue)

        contexts.push({
          id,
          name,
          value,
          annotations,
          context,
          isAddressField: contextType === 'Address',
          isDealConnectedToMls: props.deal.listing !== null
        })

        if (value) {
          defaultValues = {
            ...defaultValues,
            ...getAnnotationsValues(annotations, value, {
              maxFontSize: props.maxFontSize
            })
          }
        }
      })
    })

    props.onSetValues(defaultValues)
    setContexts(contexts)
    // eslint-disable-next-line
  }, [])

  return (
    <Fragment>
      {contexts.map(context => {
        const key = `${context.name}-${context.id}`
        const sharedProps = {
          maxFontSize: 20,
          value: context.value,
          annotations: context.annotations
        }

        if (context.isAddressField) {
          return (
            <ContextAnnotation
              {...sharedProps}
              key={key}
              annotationRenderer={props => (
                <InlineAddressField
                  style={{
                    top: props.style.top,
                    left: props.style.left,
                    width: '300px'
                  }}
                  suggestionsStyle={{
                    top: 'calc(100% + 1rem)'
                  }}
                  formStyle={{
                    top: 'calc(100% + 1rem)'
                  }}
                  handleSubmit={handleSaveAddress}
                  // address={props.value}
                  renderSearchField={inputProps => (
                    <input
                      {...inputProps}
                      style={{
                        ...props.style,
                        border: 'none',
                        top: '0',
                        left: 0
                      }}
                    />
                  )}
                />
              )}
            />
          )
        }

        return (
          <ContextAnnotation
            {...sharedProps}
            key={key}
            tooltip={getTooltip(context)}
            isReadOnly={context.isAddressField && context.isDealConnectedToMls}
            onClick={bounds =>
              props.onClick('Context', {
                bounds,
                ...context
              })
            }
          />
        )
      })}
    </Fragment>
  )
}

function getTooltip(context) {
  if (context.isAddressField && context.isDealConnectedToMls) {
    return (
      <React.Fragment>
        <img src="/static/images/deals/lock.svg" alt="locked" />
        <div>
          Listing information can only be changed on MLS. Once changed, the
          update will be reflected here.
        </div>
      </React.Fragment>
    )
  }

  return null
}

function getContextType(context) {
  if (context && DealContext.isAddressField(context.key)) {
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
