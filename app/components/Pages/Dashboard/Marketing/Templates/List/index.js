import React from 'react'
import Flex from 'styled-flex-component'
import Masonry from 'react-masonry-component'

import { ImagePreviewModal } from 'components/ImagePreviewModal'

import ContactFlow from 'components/InstantMarketing/adapters/SendContactCard'
import ListingFlow from 'components/InstantMarketing/adapters/SendMlsListingCard'

import { Loader } from '../../components/Loader'
import { Template } from './Template'
import { Tab } from './styled'

export class List extends React.Component {
  state = {
    activeFlow: '',
    isPreviewModalOpen: false,
    isContactFlowActive: false,
    isListingFlowActive: false,
    selectedTemplate: null,
    selectedMedium: ''
  }

  handleOnClickTab = e =>
    this.setState({ selectedMedium: e.target.dataset.medium })

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

  renderPanel = selectedMedium =>
    this.renderTemplates(
      this.props.templates.filter(t => t.medium === selectedMedium)
    )

  renderFlow = () => {
    const sharedProps = {
      mediums: [this.props.medium],
      selectedTemplate: this.state.selectedTemplate
    }

    switch (this.state.activeFlow) {
      case 'Birthday':
        return (
          <ContactFlow
            isTriggered={this.state.isContactFlowActive}
            handleTrigger={this.deActiveContactFlow}
            {...sharedProps}
          />
        )

      default:
        return (
          <ListingFlow
            hasExternalTrigger
            isTriggered={this.state.isListingFlowActive}
            handleTrigger={this.deActiveListingFlow}
            {...sharedProps}
          />
        )
    }
  }

  render() {
    const { props, state } = this
    const { selectedTemplate } = state
    const selectedMedium = state.selectedMedium || props.tabs[0]

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
          {props.tabs.map((medium, index) => (
            <Tab
              inverse
              key={index}
              appearance="link"
              data-medium={medium}
              onClick={this.handleOnClickTab}
              selected={selectedMedium === medium}
            >
              {medium}
            </Tab>
          ))}
        </Flex>
        {this.renderPanel(selectedMedium)}
        {state.isPreviewModalOpen && (
          <ImagePreviewModal
            isOpen
            title={selectedTemplate.name}
            handleClose={this.closePreviewModal}
            imgSrc={`${selectedTemplate.url}/preview.png`}
          />
        )}
        {this.renderFlow()}
      </div>
    )
  }
}
