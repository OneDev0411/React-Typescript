import React, { Fragment } from 'react'
import nunjucks from 'nunjucks'

import Builder from './Builder'
import { getTemplates } from '../../../models/instant-marketing/get-templates'

class InstantMarketing extends React.Component {
  state = {
    isBuilderOpen: false,
    templates: []
  }

  componentDidMount() {
    this.getTemplatesList()
  }

  getTemplatesList = async () => {
    try {
      const templates = await getTemplates()

      templates.forEach(template => {
        template.template = nunjucks.renderString(template.template, {
          listing: this.props.data
        })
      })

      this.setState({
        templates
      })
    } catch (e) {
      console.log(e)
    }
  }

  handleSave = code => {
    console.log(code)
  }

  handleOpenBuilder = () => this.setState({ isBuilderOpen: true })
  handleCloseBuilder = () => this.setState({ isBuilderOpen: false })

  render() {
    return (
      <Fragment>
        {React.cloneElement(this.props.children, {
          onClick: this.handleOpenBuilder
        })}

        {this.state.isBuilderOpen && (
          <Builder
            templates={this.state.templates}
            assets={this.props.assets}
            onSave={this.handleSave}
            onClose={this.handleCloseBuilder}
          />
        )}
      </Fragment>
    )
  }
}

export default InstantMarketing
