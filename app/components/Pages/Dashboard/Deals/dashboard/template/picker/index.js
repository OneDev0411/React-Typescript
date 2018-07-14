import React from 'react'
import { connect } from 'react-redux'

import Modal from '../../../../../../../views/components/BasicModal'
import ActionButton from '../../../../../../../views/components/Button/ActionButton'
import Template from '../../../../../../../models/template'

import TemplateThumbnail from '../../../../../../../components/Partials/Template/Thumbnail'
import TemplateBuilder from '../../../../../../../components/Partials/Template/Builder'

import Listing from '../../../../../../../models/listings/listing'

import nunjucks from 'nunjucks'

import {
  showTemplates,
} from '../../../../../../../store_actions/deals'

class Templates extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      templates: [],
      is_loading: true,
      listing: null
    }
  }

  onClose = () => this.props.showTemplates(false)

  onDone  = () => this.props.showTemplates(false)

  async componentDidMount() {
    const { deal } = this.props
    const listing = await Listing.getListing(deal.listing)

    this.setState({listing})

    const templates = await Template.getAll()

    templates.forEach(template => {
      template.template = nunjucks.renderString(template.template, {
        listing
      })
    })

    this.setState({
      is_loading: false,
      templates
    })
  }

  builderClosed() {
    this.setState({
      selectedTemplate: null
    })
  }

  render() {
    const { listing, is_loading, templates } = this.state

    if (!this.props.templates.showTemplates)
      return null

    if (is_loading)
      return null

    return (
      <TemplateBuilder
        templates={ templates }
        onClose={ this.builderClosed.bind(this) }
        assets={ listing.gallery_image_urls }
      />
    )
  }
}

export default connect(
  ({ deals }) => ({
    templates: deals.templates,
  }),
  { showTemplates }
)(Templates)

// export default Templates
