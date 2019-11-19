import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { getTemplates } from 'models/instant-marketing/get-templates'
import { loadTemplateHtml } from 'models/instant-marketing/load-template'
import { getActiveTeamId } from 'utils/user-teams'

import Spinner from 'components/Spinner'

import { getBrandByType } from 'utils/user-teams'

import { Container, TemplateItem, Video, Image } from './styled'

class Templates extends React.Component {
  state = {
    isLoading: true,
    selectedTemplate: null,
    templates: []
  }

  componentDidMount() {
    if (this.props.isEdit) {
      this.setState(
        {
          isLoading: false,
          templates: [this.props.defaultTemplate]
        },
        () => {
          this.handleSelectTemplate(this.props.defaultTemplate)
        }
      )
    } else {
      this.getTemplatesList()
    }
  }

  getTemplatesList = async () => {
    const { medium, defaultTemplate, templateTypes: types } = this.props
    const activeTeamBrandId = getActiveTeamId(this.props.user)

    try {
      let templates = await getTemplates(
        activeTeamBrandId,
        types,
        medium ? [medium] : []
      )

      if (templates.length > 0) {
        // sort template based on their types
        templates = _.sortBy(templates, template =>
          types.indexOf(template.template_type)
        )

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
    const brokerageBrand = getBrandByType(this.props.user, 'Brokerage')

    return (
      <Container>
        {this.state.isLoading && <Spinner />}

        {this.state.templates.map(template => {
          const preview_url = template.file
            ? template.file.preview_url
            : `${template.url}/${brokerageBrand.id}/thumbnail.png`

          return (
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
                  src={preview_url}
                  title={template.name}
                  width="97%"
                  style={{
                    margin: '1.5%',
                    boxShadow: '0px 5px 10px #c3c3c3'
                  }}
                />
              )}
            </TemplateItem>
          )
        })}
      </Container>
    )
  }
}

export default connect(state => ({ user: state.user }))(Templates)
