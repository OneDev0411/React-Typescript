import React from 'react'

import { Box, CircularProgress } from '@material-ui/core'
import { connect } from 'react-redux'
import _ from 'underscore'

import { selectActiveBrandIdUnsafe } from '@app/selectors/brand'
import { getTemplates } from 'models/instant-marketing/get-templates'
import { loadTemplateHtml } from 'models/instant-marketing/load-template'
import {
  getTemplateImageOrVideo,
  isVideoThumb
} from 'utils/marketing-center/helpers'

import { SAVED_TEMPLATE_VARIANT } from '../Builder/AddToMarketingCenterButton/constants'

import { Container, TemplateItem, Video, Image } from './styled'
import TemplateTypesSelect from './TemplateTypesSelect'

class Templates extends React.Component {
  state = {
    isLoading: true,
    selectedTemplate: null,
    templates: [],
    currentTemplatesTypes: [],
    selectedTemplateType: null
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
      this.fetchTemplatesList()
    }
  }

  fetchTemplatesList = async () => {
    const {
      medium,
      activeBrandId,
      defaultTemplate,
      templateTypes: types
    } = this.props

    try {
      let templates = await getTemplates(
        activeBrandId,
        types,
        medium ? [medium] : []
      )

      if (templates.length > 0) {
        // sort template based on their types
        templates = _.sortBy(templates, brandTemplate =>
          types.indexOf(brandTemplate.template.template_type)
        )

        // Reordering templates list and show the default tempalte
        // as the first item of the list
        if (defaultTemplate) {
          templates = [
            defaultTemplate,
            ...templates.filter(t => t.id !== defaultTemplate.id)
          ]
        } else {
          const savedTemplates = templates.filter(
            brandTemplate =>
              brandTemplate.template.variant === SAVED_TEMPLATE_VARIANT
          )

          const otherTemplates = templates.filter(
            brandTemplate =>
              brandTemplate.template.variant !== SAVED_TEMPLATE_VARIANT
          )

          templates = [...otherTemplates, ...savedTemplates]
        }

        const currentTemplatesTypes = [
          ...new Set(
            templates
              .map(item => item.template.template_type)
              .filter(type => !!type)
          )
        ]

        const selectedTemplateType = currentTemplatesTypes.length
          ? currentTemplatesTypes[0]
          : null

        currentTemplatesTypes.sort()

        this.setState(
          {
            templates,
            currentTemplatesTypes,
            selectedTemplateType,
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

    if (!template.markup) {
      template.markup =
        template.type === 'template'
          ? template.template // my designs templates
          : await loadTemplateHtml(template) // brand templates

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
        {this.state.isLoading && (
          <Box
            pt={2}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress />
          </Box>
        )}

        {this.state.currentTemplatesTypes.length > 0 && (
          <TemplateTypesSelect
            items={this.state.currentTemplatesTypes}
            value={this.state.selectedTemplateType}
            onSelect={value => {
              this.setState({
                selectedTemplateType: value
              })
            }}
          />
        )}
        {this.state.templates
          .filter(
            brandTemplate =>
              this.state.selectedTemplateType ===
              brandTemplate.template.template_type
          )
          .map(template => {
            return (
              <TemplateItem
                key={template.id}
                onClick={() => this.handleSelectTemplate(template)}
                isSelected={this.state.selectedTemplate === template.id}
              >
                {isVideoThumb(template) ? (
                  <Video
                    autoPlay="true"
                    muted
                    loop="true"
                    type="video/mp4"
                    width="97%"
                    src={getTemplateImageOrVideo(template).thumbnail}
                  />
                ) : (
                  <Image
                    alt={template.template.name}
                    title={template.template.name}
                    src={getTemplateImageOrVideo(template).original}
                    width="97%"
                  />
                )}
              </TemplateItem>
            )
          })}
      </Container>
    )
  }
}

export default connect(state => ({
  activeBrandId: selectActiveBrandIdUnsafe(state) ?? ''
}))(Templates)
