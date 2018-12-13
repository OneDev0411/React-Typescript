import React from 'react'

import { getTemplates } from 'models/instant-marketing/get-templates'
import { loadTemplateHtml } from 'models/instant-marketing/load-template'

import Spinner from 'components/Spinner'

import { Container, TemplateItem, Video, Image } from './styled'

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
    const { medium, defaultTemplate, templateTypes: types } = this.props

    try {
      let templates = await getTemplates(types, medium ? [medium] : [])

      if (templates.length > 0) {
        // Reordering templates list and show the default tempalte
        // as the first item of the list
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
        {this.state.isLoading && <Spinner />}

        {this.state.templates.map(template => (
          <TemplateItem
            key={template.id}
            onClick={() => this.handleSelectTemplate(template)}
            isSelected={this.state.selectedTemplate === template.id}
          >
            {template.video ? (
              <Video
                autoPlay="true"
                loop="true"
                type="video/mp4"
                src={`${template.url}/thumbnail.mp4`}
              />
            ) : (
              <Image
                src={`${template.url}/thumbnail.png`}
                title={template.name}
                width="97%"
                style={{
                  minHeight: '200px',
                  margin: '1.5%',
                  boxShadow: '0px 5px 10px #c3c3c3'
                }}
              />
            )}
          </TemplateItem>
        ))}
      </Container>
    )
  }
}
