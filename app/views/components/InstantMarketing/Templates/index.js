import React from 'react'

import { getTemplates } from 'models/instant-marketing/get-templates'
import { loadTemplateHtml } from 'models/instant-marketing/load-template'

import { Container, TemplateItem, TemplateImage } from './styled'
import Loader from '../../../../components/Partials/Loading'

export default class Templates extends React.Component {
  state = {
    isLoading: true,
    selectedTemplate: null,
    templates: []
  }

  componentDidMount() {
    this.getTemplatesList()
  }

  getTemplatesList = async () => {
    const { mediums, templateTypes: types } = this.props

    try {
      const templates = await getTemplates(types, mediums)

      this.setState({
        templates,
        selectedTemplate: templates.length > 0 ? templates[0].id : null
      })

      if (templates.length > 0) {
        this.handleSelectTemplate(templates[0])
      }
    } catch (e) {
      console.log(e)
    } finally {
      this.setState({
        isLoading: false
      })
    }
  }

  handleSelectTemplate = async template => {
    this.setState({
      selectedTemplate: template.id
    })

    if (!template.template) {
      template.template = await loadTemplateHtml(`${template.url}/index.html`)

      // append fetched html into template data
      this.updateTemplate(template)
    }

    this.props.onTemplateSelect(template)
  }

  updateTemplate = template => {
    const templates = this.state.templates.map(
      item => (item.id === template.id ? template : item)
    )

    this.setState({ templates })
  }

  render() {
    return (
      <Container>
        {this.state.isLoading && <Loader />}

        {this.state.templates.map(template => (
          <TemplateItem
            key={template.id}
            onClick={() => this.handleSelectTemplate(template)}
            isSelected={this.state.selectedTemplate === template.id}
          >
            <TemplateImage
              src={`${template.url}/thumbnail.png`}
              title={template.name}
            />
          </TemplateItem>
        ))}
      </Container>
    )
  }
}
