import React from 'react'
import { connect } from 'react-redux'
import TemplateBuilder from '../../../../../Partials/Template/Builder'

import {
  showBuilder,
} from '../../../../../../store_actions/deals'

class DealTemplateBuilder extends React.Component {
  render() {
    const { templates } = this.props

    if (!templates.showBuilder)
      return null

    return (
      <TemplateBuilder
        template={ this.props.template }
      />
    )
  }
}

export default connect(
  ({ deals }) => ({
    templates: deals.templates,
  }),
  { showBuilder }
)(DealTemplateBuilder)
