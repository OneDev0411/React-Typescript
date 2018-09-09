import React from 'react'

import { getTemplates } from '../../../../models/instant-marketing/get-templates'

import { Container, TemplateImage } from './styled'
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
    try {
      const templates = await getTemplates()

      this.setState({
        templates,
        selectedTemplate: templates.length > 0 ? templates[0].id : null
      })

      if (templates.length > 0) {
        this.props.onTemplateSelect(templates[0])
      }
    } catch (e) {
      console.log(e)
    } finally {
      this.setState({
        isLoading: false
      })
    }
  }

  handleSelectTemplate = template => {
    this.setState({
      selectedTemplate: template.id
    })

    this.props.onTemplateSelect(template)
  }

  render() {
    return (
      <Container>
        {this.state.isLoading && <Loader />}

        {this.state.templates.map(template => (
          <TemplateImage
            key={template.id}
            src={template.thumbnail}
            title={template.name}
            isSelected={this.state.selectedTemplate === template.id}
            onClick={() => this.handleSelectTemplate(template)}
          />
        ))}
      </Container>
    )
  }
}
