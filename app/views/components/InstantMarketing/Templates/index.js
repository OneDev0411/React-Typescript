import React from 'react'
import idx from 'idx'

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
      let templates = await getTemplates(types, mediums)

      if (templates.length > 0) {
        if (defaultTemplate) {
          templates = [
            defaultTemplate,
            ...templates.filter(t => t.id !== defaultTemplate.id)
          ]
        }

        this.setState(
          {
            templates,
            selectedTemplate: templates[0].id
          },
          () => this.handleSelectTemplate(templates[0])
        )
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
