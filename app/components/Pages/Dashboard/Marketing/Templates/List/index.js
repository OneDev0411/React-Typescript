import React from 'react'
import Flex from 'styled-flex-component'
import { groupBy } from 'lodash'
import Masonry from 'react-masonry-component'

import { PreviewImageModal } from 'components/PreviewImageModal'
import ContactFlow from 'components/InstantMarketing/adapters/SendContactCard'
import ListingFlow from 'components/InstantMarketing/adapters/SendMlsListingCard'

import { templateTypes } from '../data'
import { Template } from './Template'
import { Loader, Tab } from './styled'

export class List extends React.Component {
  state = {
    activeFlow: '',
    selectedTemplate: null,
    isPreviewModalOpen: false,
    isContactFlowActive: false,
    isListingFlowActive: false
  }

  closePreviewModal = () => {
    this.setState({ isPreviewModalOpen: false, selectedTemplate: null })
  }

  openPreviewModal = selectedTemplate =>
    this.setState({ selectedTemplate, isPreviewModalOpen: true })

  activeContactFlow = selectedTemplate =>
    this.setState({
      selectedTemplate,
      isContactFlowActive: true
    })

  deActiveContactFlow = () =>
    this.setState({
      isContactFlowActive: false
    })

  activeListingFlow = selectedTemplate =>
    this.setState({
      selectedTemplate,
      isListingFlowActive: true
    })

  deActiveListingFlow = () =>
    this.setState({
      isListingFlowActive: false
    })

  handleCustomize = template =>
    this.setState({ activeFlow: template.template_type }, () => {
      switch (template.template_type) {
        case 'Birthday':
          this.activeContactFlow(template)
          break

        default:
          this.activeListingFlow(template)
          break
      }
    })

  renderTemplate = template => (
    <Template
      key={template.id}
      template={template}
      isSideMenuOpen={this.props.isSideMenuOpen}
      handlePreview={() => this.openPreviewModal(template)}
      handleCustomize={() => this.handleCustomize(template)}
    />
  )

  renderTemplates = templates => (
    <Masonry
      options={{ transitionDuration: 0 }}
      style={{ margin: '0 -0.75rem' }}
    >
      {templates.map(this.renderTemplate)}
    </Masonry>
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

  renderFlow = () => {
    switch (this.state.activeFlow) {
      case 'Birthday':
        return (
          <ContactFlow
            selectedTemplate={this.state.selectedTemplate}
            isTriggered={this.state.isContactFlowActive}
            handleTrigger={this.deActiveContactFlow}
          />
        )

      default:
        return (
          <ListingFlow
            hasExternalTrigger
            selectedTemplate={this.state.selectedTemplate}
            isTriggered={this.state.isListingFlowActive}
            handleTrigger={this.deActiveListingFlow}
          />
        )
    }
  }

  render() {
    const { props, state } = this
    const { selectedTemplate } = state
    const selectedType = props.types || 'All'

    if (props.isLoading) {
      return (
        <Flex center style={{ paddingTop: '5rem' }}>
          <Loader />
        </Flex>
      )
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
        {state.isPreviewModalOpen && (
          <PreviewImageModal
            isOpen
            handleClose={this.closePreviewModal}
            title={selectedTemplate.name || ''}
            imgSrc={`${selectedTemplate.url}/thumbnail.png`}
          />
        )}
        {this.renderFlow()}
      </div>
    )
  }
}
