import React, { Fragment } from 'react'
import _ from 'underscore'

import DealContext from 'models/Deal/helpers/dynamic-context'

import { getAnnotationsValues } from '../../../../utils/word-wrap'

import ContextAnnotation from '../ContextAnnotation'

export class FormContext extends React.Component {
  state = {
    contexts: []
  }

  componentDidMount() {
    this.initialize()
  }

  initialize = () => {
    const { props } = this

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
        const contextType = this.getContextType(context)
        const formValue = this.getFormValue(props.formValues, annotations)

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
              maxFontSize: this.props.maxFontSize
            })
          }
        }
      })
    })

    this.props.onSetValues(defaultValues)
    this.setState({
      contexts
    })
  }

  getContextType = context => {
    if (context && DealContext.isAddressField(context.name)) {
      return 'Address'
    }

    return 'Singular'
  }

  getFormValue = (values, annotations) => {
    const valueList = annotations
      .map(ann => values[ann.fieldName])
      .filter(Boolean)

    if (valueList.length === 0) {
      return undefined
    }

    return valueList.join(' ')
  }

  getTooltip = context => {
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

  render() {
    return (
      <Fragment>
        {this.state.contexts.map(context => (
          <ContextAnnotation
            key={`${context.name}-${context.id}`}
            maxFontSize={20}
            value={context.value}
            annotations={context.annotations}
            tooltip={this.getTooltip(context)}
            isReadOnly={context.isAddressField && context.isDealConnectedToMls}
            onClick={bounds =>
              this.props.onClick('Context', {
                bounds,
                ...context
              })
            }
          />
        ))}
      </Fragment>
    )
  }
}
