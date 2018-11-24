import React from 'react'
import Flex from 'styled-flex-component'
import { groupBy } from 'lodash'

import { PreviewImageModal } from 'components/PreviewImageModal'

import { templateTypes } from '../data'
import { Template } from './Template'
import { Loader, Tab } from './styled'

export class List extends React.Component {
  state = {
    selectedTemplate: null
  }

  closePreviewModal = () => {
    this.setState({ selectedTemplate: null })
  }

  openPreviewModal = selectedTemplate => this.setState({ selectedTemplate })

  renderTemplate = template => (
    <Template
      key={template.id}
      template={template}
      isSideMenuOpen={this.props.isSideMenuOpen}
      handlePreview={() => this.openPreviewModal(template)}
    />
  )

  renderTemplates = templates => (
    <Flex wrap>{templates.map(this.renderTemplate)}</Flex>
  )

  renderAll = () => {
    const { templates } = this.props

    const allTemplates = groupBy(templates, 'template_type')

    return Object.keys(allTemplates).map(type => (
      <div key={type} style={{ marginBottom: '0.5rem' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          {templateTypes[type] || type}
        </div>
        {this.renderTemplates(allTemplates[type])}
      </div>
    ))
  }

  renderByType = selectedType =>
    this.renderTemplates(
      this.props.templates.filter(t => t.template_type === selectedType)
    )

  renderPanel = selectedType => {
    if (selectedType === 'All') {
      return this.renderAll()
    }

    return this.renderByType(selectedType)
  }

  render() {
    const { props, state } = this
    const { selectedTemplate } = state
    const selectedType = props.types || 'All'

    if (props.isLoading) {
      return <Loader />
    }

    if (props.templates.length === 0) {
      return null
    }

    return (
      <div style={{ padding: '0 1.5rem' }}>
        <Flex wrap style={{ marginBottom: '2rem' }}>
          {props.tabs.map(({ title, type }, index) => (
            <Tab
              inverse
              key={index}
              data-type={type}
              to={`/dashboard/marketing/${props.medium}/${type}`}
              selected={selectedType === type}
            >
              {title}
            </Tab>
          ))}
        </Flex>
        {this.renderPanel(selectedType)}
        {selectedTemplate && (
          <PreviewImageModal
            isOpen
            handleClose={this.closePreviewModal}
            title={selectedTemplate.name || ''}
            imgSrc={`${selectedTemplate.url}/thumbnail.png`}
          />
        )}
      </div>
    )
  }
}
