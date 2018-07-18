import React from 'react'
import nunjucks from 'nunjucks'

import { getTemplates } from '../../../../models/instant-marketing/get-templates'

import { Container, TemplateImage, Title } from './styled'
import Loader from '../../../../components/Partials/Loading'

export default class Templates extends React.Component {
  state = {
    isLoading: true,
    templates: []
  }

  componentDidMount() {
    this.getTemplatesList()
  }

  getTemplatesList = async () => {
    try {
      const templates = await getTemplates()

      const compiledTemplates = templates.map(item => ({
        ...item,
        template: nunjucks.renderString(item.template, {
          ...this.props.templateData
        })
      }))

      this.setState({
        templates: compiledTemplates
      })

      if (compiledTemplates.length > 0) {
        this.props.onTemplateSelect(compiledTemplates[0])
      }
    } catch (e) {
      console.log(e)
    } finally {
      this.setState({
        isLoading: false
      })
    }
  }

  render() {
    return (
      <Container>
        <Title>Page Templates</Title>

        {this.state.isLoading && <Loader />}

        {this.state.templates.map(template => (
          <TemplateImage
            key={template.id}
            src={template.thumbnail}
            title={template.name}
            onClick={() => this.props.onTemplateSelect(template)}
            alt=""
          />
        ))}
      </Container>
    )
  }
}
