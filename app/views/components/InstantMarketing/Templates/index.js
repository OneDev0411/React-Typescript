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
    const { mediums, defaultTemplate, templateTypes: types } = this.props

    try {
      const templates = await getTemplates(types, mediums)

      this.setState({
        templates,
        selectedTemplate: templates.length > 0 ? templates[0].id : null
      })

      if (templates.length > 0) {
        const selectedTemplate = defaultTemplate
          ? templates.filter(t => t.id === defaultTemplate.id)
          : templates

        this.handleSelectTemplate(selectedTemplate[0])
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

  updateTemplate = template =>
    this.setState(state => ({
      templates: state.templates.map(item =>
        item.id === template.id ? template : item
      )
    }))

  render() {
    let { templates, selectedTemplate } = this.state

    // Reordering templates list and show the default tempalte as the first item
    // of the list
    if (templates.length > 0 && selectedTemplate !== templates[0].id) {
      templates = [
        this.props.defaultTemplate,
        ...templates.filter(t => t.id !== selectedTemplate)
      ]
    }

    return (
      <Container>
        {this.state.isLoading && <Loader />}

        {templates.map(template => (
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
