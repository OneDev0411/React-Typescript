import React from 'react'

import { getTemplates } from 'models/instant-marketing/get-templates'
import { loadTemplateHtml } from 'models/instant-marketing/load-template'

import Image from 'components/ImageLoader'
import Spinner from 'components/Spinner'

import { Container, TemplateItem, LoaderIndicator } from './styled'

export default class Templates extends React.Component {
  state = {
    isLoading: true,
    isFetchingTemplate: [],
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
      this.setState(state => ({
        isFetchingTemplate: [...state.isFetchingTemplate, template.id]
      }))

      template.template = await loadTemplateHtml(`${template.url}/index.html`)

      // append fetched html into template data
      this.updateTemplate(template)

      this.setState(state => ({
        isFetchingTemplate: state.isFetchingTemplate.filter(
          id => id !== template.id
        )
      }))
    }

    this.props.onTemplateSelect(template)
  }

  updateTemplate = template =>
    this.setState(state => ({
      templates: state.templates.map(
        item => (item.id === template.id ? template : item)
      )
    }))

  isLoadingTemplate = id => this.state.isFetchingTemplate.includes(id)

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
            {this.isLoadingTemplate(template.id) && <LoaderIndicator />}

            <Image
              src={`${template.url}/thumbnail.png`}
              title={template.name}
              width="97%"
              style={{
                minHeight: '200px',
                margin: '1.5%',
                boxShadow: '0px 5px 10px #c3c3c3',
                filter: this.isLoadingTemplate(template.id)
                  ? 'blur(4px)'
                  : 'none'
              }}
            />
          </TemplateItem>
        ))}
      </Container>
    )
  }
}
