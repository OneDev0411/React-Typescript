import React from 'react'
import Flex from 'styled-flex-component'
import Masonry from 'react-masonry-component'

import Button from 'components/Button/ActionButton'
import { ImagePreviewModal } from 'components/ImagePreviewModal'
import GeneralFlow from 'components/InstantMarketing/adapters/General'
import ContactFlow from 'components/InstantMarketing/adapters/SendContactCard'
import ListingFlow from 'components/InstantMarketing/adapters/SendMlsListingCard'

import { Loader } from '../../components/Loader'
import { Template } from '../../components/Template'
import { mediumsCollection } from './mediums-collection'
import { Tab, ListContainer } from './styled'

const GENERAL_FLOW_TYPES = [
  'Brand',
  'Christmas,NewYear,Valentines,StPatrick',
  'NewAgent'
]

export class List extends React.Component {
  state = {
    isPreviewModalOpen: false,
    isContactFlowActive: false,
    isGeneralFlowActive: false,
    isListingFlowActive: false,
    selectedTemplate: null
  }

  closePreviewModal = () => {
    this.setState({ isPreviewModalOpen: false })
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

  activeGeneralFlow = selectedTemplate =>
    this.setState({
      selectedTemplate,
      isGeneralFlowActive: true
    })

  deActiveGeneralFlow = () =>
    this.setState({
      isGeneralFlowActive: false
    })

  getSelectedMediumTemplates = () =>
    this.props.templates.filter(t => t.medium === this.props.medium)

  getTemplateIndex = template =>
    this.getSelectedMediumTemplates().findIndex(t => t.id === template.id)

  handleKeyDown = e => {
    const { selectedTemplate } = this.state

    if (!selectedTemplate) {
      return
    }

    const templates = this.getSelectedMediumTemplates()
    const selectedTemplateIndex = this.getTemplateIndex(selectedTemplate)

    let nextIndex = selectedTemplateIndex

    if (e.key === 'ArrowLeft') {
      nextIndex =
        selectedTemplateIndex === 0
          ? templates.length - 1
          : selectedTemplateIndex - 1
    }

    if (e.key === 'ArrowRight') {
      nextIndex =
        selectedTemplateIndex === templates.length - 1
          ? 0
          : selectedTemplateIndex + 1
    }

    this.setState({
      selectedTemplate: templates[nextIndex]
    })
  }

  handleCustomize = template => {
    const { types } = this.props

    if (types === 'Birthday') {
      this.activeContactFlow(template)
    } else if (GENERAL_FLOW_TYPES.includes(types)) {
      this.activeGeneralFlow(template)
    } else {
      this.activeListingFlow(template)
    }
  }

  handlePreviewCustomize = () =>
    this.setState(
      {
        isPreviewModalOpen: false
      },
      () => this.handleCustomize(this.state.selectedTemplate)
    )

  renderTemplate = template => (
    <Template
      key={template.id}
      template={template}
      isSideMenuOpen={this.props.isSideMenuOpen}
      handlePreview={() => this.openPreviewModal(template)}
      handleCustomize={() => this.handleCustomize(template)}
    />
  )

  renderList = () => (
    <ListContainer isSideMenuOpen={this.props.isSideMenuOpen}>
      <Masonry options={{ transitionDuration: 0 }}>
        {this.getSelectedMediumTemplates().map(this.renderTemplate)}
      </Masonry>
    </ListContainer>
  )

  renderFlow = () => {
    const { props, state } = this
    const sharedProps = {
      mediums: props.medium,
      selectedTemplate: state.selectedTemplate
    }

    if (props.types === 'Birthday') {
      return (
        <ContactFlow
          {...sharedProps}
          isTriggered={state.isContactFlowActive}
          handleTrigger={this.deActiveContactFlow}
        />
      )
    }

    if (GENERAL_FLOW_TYPES.includes(props.types)) {
      return (
        <GeneralFlow
          {...sharedProps}
          hasExternalTrigger
          types={props.types.split(',')}
          isTriggered={state.isGeneralFlowActive}
          handleTrigger={this.deActiveGeneralFlow}
        />
      )
    }

    return (
      <ListingFlow
        {...sharedProps}
        hasExternalTrigger
        isTriggered={state.isListingFlowActive}
        handleTrigger={this.deActiveListingFlow}
      />
    )
  }

  renderPreviewModalMenu = () => (
    <Button onClick={this.handlePreviewCustomize}>Customize</Button>
  )

  render() {
    const { props, state } = this
    const { selectedTemplate } = state
    const selectedMedium = props.medium

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
              to={`/dashboard/marketing/${props.types}/${medium}`}
              selected={selectedMedium === medium}
            >
              {mediumsCollection[medium] || medium}
            </Tab>
          ))}
        </Flex>
        {this.renderList()}
        {state.isPreviewModalOpen && (
          <ImagePreviewModal
            isOpen
            handleClose={this.closePreviewModal}
            handleKeyDown={this.handleKeyDown}
            imgSrc={`${selectedTemplate.url}/preview.png`}
            menuRenderer={this.renderPreviewModalMenu}
          />
        )}
        {this.renderFlow()}
      </div>
    )
  }
}
