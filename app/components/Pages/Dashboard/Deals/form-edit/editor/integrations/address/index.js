import React from 'react'

import Address from '../../../../components/address'
import DealContext from '../../../../../../../../models/DealContext'
import { getAnnotationsValues } from '../../../utils/word-wrap'

export default class AddressForm extends React.Component {
  onClose = deal => {
    if (!deal) {
      return false
    }

    const { data } = this.props.selectedAnnotation
    const { contextName, annotations } = data

    const text = DealContext.getValue(
      deal,
      DealContext.searchContext(contextName)
    ).value

    const values = getAnnotationsValues(annotations, text, {
      maxFontSize: 20
    })

    console.log(values)

    this.props.onSetValues(values)
    this.props.onClose()
  }

  render() {
    return (
      <Address
        show={this.props.isOpen || false}
        onClose={this.onClose}
        deal={this.props.deal}
      />
    )
  }
}
