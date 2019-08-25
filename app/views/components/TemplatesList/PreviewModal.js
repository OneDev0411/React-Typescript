import React from 'react'
import { connect } from 'react-redux'

import { getBrandByType } from 'utils/user-teams'
import { ImagePreviewModal } from 'components/ImagePreviewModal'

import PreviewModalMenu from './PreviewModalMenu'
import {
  getTemplateImage,
  selectPreviousTemplate,
  selectNextTemplate,
  navigateBetweenTemplatesUsingKeyboard
} from './helpers'

function PreviewModal(props) {
  const { selectedTemplate, templates, medium } = props

  if (!selectedTemplate) {
    return null
  }

  const brokerageBrand = getBrandByType(props.user, 'Brokerage')
  const { thumbnail: imgSrcTiny, original: imgSrc } = getTemplateImage(
    selectedTemplate,
    brokerageBrand
  )

  let modalProps = {
    isOpen: props.isPreviewModalOpen,
    handleClose: () => props.setPreviewModalOpen(false),
    menuRenderer: () => (
      <PreviewModalMenu
        selectedTemplate={selectedTemplate}
        handlePreviewShare={() => {
          props.setPreviewModalOpen(false)
          props.setActionTriggered(true)
        }}
      />
    )
  }

  if (props.type === 'history') {
    modalProps = {
      ...modalProps,
      imgSrc
    }
  } else {
    modalProps = {
      ...modalProps,
      showPreviousButton: true,
      onPreviousButtonClick: e => {
        e.stopPropagation()

        const previous = selectPreviousTemplate(
          templates,
          selectedTemplate,
          medium
        )

        if (previous) {
          props.setSelectedTemplate(previous)
        }
      },
      showNextButton: true,
      onNextButtonClick: e => {
        e.stopPropagation()

        const next = selectNextTemplate(templates, selectedTemplate, medium)

        if (next) {
          props.setSelectedTemplate(next)
        }
      },
      handleKeyDown: e => {
        const nextTemplate = navigateBetweenTemplatesUsingKeyboard(
          e.key,
          templates,
          selectedTemplate,
          medium
        )

        if (nextTemplate) {
          props.setSelectedTemplate(nextTemplate)
        }
      },
      imgSrc,
      imgSrcTiny
    }
  }

  return props.isPreviewModalOpen && <ImagePreviewModal {...modalProps} />
}

export default connect(({ user }) => ({ user }))(PreviewModal)
