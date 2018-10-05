import React from 'react'
import _ from 'underscore'

import Address from '../../../../components/Address'
import { getAnnotationsValues } from '../../../utils/word-wrap'

export default class AddressForm extends React.Component {
  get GroupedContexts() {
    const { contextsAnnotations } = this.props

    const grouped = {}
    const groupedContexts = _.groupBy(contextsAnnotations, 'context')

    _.each(groupedContexts, (data, context_name) => {
      grouped[context_name] = _.groupBy(groupedContexts[context_name], 'group')
    })

    return grouped
  }

  calculateAnnotationsValues(address_components) {
    let formData = {}

    const grouped = this.GroupedContexts

    _.forEach(address_components, (fieldValue, fieldName) => {
      const groups = grouped[fieldName]

      _.map(groups, group => {
        const annotations = group.map(i => i.annotation)

        const values = getAnnotationsValues(annotations, fieldValue, {
          maxFontSize: 20
        })

        formData = {
          ...formData,
          ...values
        }
      })
    })

    return formData
  }

  onClose = (deal, address) => {
    if (!deal) {
      this.props.onClose()

      return false
    }

    const formData = this.calculateAnnotationsValues(address.address_components)

    this.props.onSetValues(formData, true)
    this.props.onClose()
  }

  render() {
    return (
      <Address
        show={this.props.isOpen || false}
        closeOnBackdropClick={false}
        onClose={this.onClose}
        deal={this.props.deal}
      />
    )
  }
}
