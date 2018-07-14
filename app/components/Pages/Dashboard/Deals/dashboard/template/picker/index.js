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
      showBuilder: false,
      selectedTemplate: null,
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

    this.setState({
      is_loading: false,
      templates
    })
  }

  templateClicked(template) {
    this.setState({
      showBuilder: true,
      selectedTemplate: template
    })
  }

  builderClosed() {
    this.setState({
      showBuilder: false,
      selectedTemplate: null
    })
  }

  body() {
    const { deal } = this.props

    if (this.state.is_loading)
      return (
        <div className="loading">
          <i className="fa fa-spin fa-spinner fa-3x" />
        </div>
      )

    const { listing } = this.state

    const thumbnails = this.state.templates.map(template => {
      const rendered = nunjucks.renderString(template.template, {
        listing
      })

      console.log(rendered)

      template.template = rendered

      return (
        <TemplateThumbnail
          key={ template.id }
          template={ template }
          width={ 200 }
          height={ 100 }
          onClick={ this.templateClicked.bind(this, template) }
        />
      )
    })

    return (
      <div>
        {thumbnails}
      </div>
    )
  }

  render() {
    const { templates } = this.props
    const { showBuilder, selectedTemplate, listing } = this.state

    if (showBuilder)
      return (
        <TemplateBuilder
          template={ selectedTemplate.template }
          onClose={ this.builderClosed.bind(this) }
          assets={ listing.gallery_image_urls }
        />
      )

    return (
      <Modal
        isOpen={ templates.showTemplates }
        handleOnClose={ this.onClose }
      >
        <Modal.Header
          title="Pick a Template"
          handleOnClose={this.onClose}
        />

        <Modal.Body className="modal-body">
          {this.body()}
        </Modal.Body>
      </Modal>
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
