import React from 'react'
import Flex from 'styled-flex-component'
import Masonry from 'react-masonry-component'

import Button from 'components/Button/ActionButton'
import { ImagePreviewModal } from 'components/ImagePreviewModal'
import ShareInstance from 'components/InstantMarketing/adapters/ShareInstance'

import { Loader } from '../../components/Loader'
import { Template } from '../../components/Template'
import { ListContainer } from '../../Templates/List/styled'

export class List extends React.Component {
  state = {
    selectedTemplate: null,
    isPreviewModalOpen: false,
    isShareFlowActive: false
  }

  closePreviewModal = () => {
    this.setState({ isPreviewModalOpen: false })
  }

  openPreviewModal = selectedTemplate =>
    this.setState({ selectedTemplate, isPreviewModalOpen: true })

  activeListingFlow = selectedTemplate =>
    this.setState({
      selectedTemplate,
      isShareFlowActive: true
    })

  deActiveFlow = () =>
    this.setState({
      isShareFlowActive: false
    })

  handlePreviewShare = () =>
    this.setState({
      isPreviewModalOpen: false,
      isShareFlowActive: true
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

  renderList = () => (
    <ListContainer isSideMenuOpen={this.props.isSideMenuOpen}>
      <Masonry options={{ transitionDuration: 0 }}>
        {this.props.templates.map(this.renderTemplate)}
      </Masonry>
    </ListContainer>
  )

  renderPreviewModalMenu = () => (
    <Button onClick={this.handlePreviewShare}>{`${
      this.state.selectedTemplate.template.medium === 'Social'
        ? 'Share'
        : 'Compose'
    }`}</Button>
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
        {this.renderList(templates)}
        {state.isPreviewModalOpen && (
          <ImagePreviewModal
            isOpen
            title="Preview"
            handleClose={this.closePreviewModal}
            imgSrc={selectedTemplate.file.preview_url}
            menuRenderer={this.renderPreviewModalMenu}
          />
        )}
        <ShareInstance
          hasExternalTrigger
          isTriggered={this.state.isShareFlowActive}
          handleTrigger={this.deActiveFlow}
          instance={selectedTemplate}
        />
      </React.Fragment>
    )
  }
}
