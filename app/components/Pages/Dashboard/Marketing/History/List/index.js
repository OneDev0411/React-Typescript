import React from 'react'
import Flex from 'styled-flex-component'
import Masonry from 'react-masonry-component'

import { ImagePreviewModal } from 'components/ImagePreviewModal'

import ListingFlow from 'components/InstantMarketing/adapters/SendMlsListingCard'

import { Loader } from '../../components/Loader'
import { Template } from '../../components/Template'

export class List extends React.Component {
  state = {
    selectedTemplate: null,
    isPreviewModalOpen: false,
    isListingFlowActive: false
  }

  closePreviewModal = () => {
    this.setState({ isPreviewModalOpen: false, selectedTemplate: null })
  }

  openPreviewModal = selectedTemplate =>
    this.setState({ selectedTemplate, isPreviewModalOpen: true })

  activeListingFlow = selectedTemplate =>
    this.setState({
      selectedTemplate,
      isListingFlowActive: true
    })

  deActiveListingFlow = () =>
    this.setState({
      isListingFlowActive: false
    })

  renderTemplate = template => (
    <Template
      key={template.id}
      template={template}
      isSideMenuOpen={this.props.isSideMenuOpen}
      handlePreview={() => this.openPreviewModal(template)}
      handleCustomize={() => this.activeListingFlow(template)}
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

  render() {
    const { props, state } = this
    const { selectedTemplate } = state

    if (props.isLoading) {
      return (
        <Flex center style={{ paddingTop: '5rem' }}>
          <Loader />
        </Flex>
      )
    }

    const { templates } = props
    const listLength = templates.length

    if (listLength === 0) {
      return null
    }

    return (
      <React.Fragment>
        <div style={{ margin: '1.5rem 0 1rem', fontWeight: 500 }}>
          {`${listLength} Design${listLength > 1 ? 's' : ''}`}
        </div>
        {this.renderTemplates(templates)}
        {state.isPreviewModalOpen && (
          <ImagePreviewModal
            isOpen
            title={selectedTemplate.file.name}
            handleClose={this.closePreviewModal}
            imgSrc={`${selectedTemplate.template.url}/preview.png`}
          />
        )}
        <ListingFlow
          hasExternalTrigger
          isTriggered={this.state.isListingFlowActive}
          handleTrigger={this.deActiveListingFlow}
          mediums={['Social']}
          selectedTemplate={selectedTemplate}
        />
      </React.Fragment>
    )
  }
}
