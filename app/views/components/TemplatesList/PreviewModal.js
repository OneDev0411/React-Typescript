import React from 'react'

import { ImagePreviewModal } from 'components/ImagePreviewModal'

import PreviewModalMenu from './PreviewModalMenu'
import {
  selectPreviousTemplate,
  selectNextTemplate,
  navigateBetweenTemplatesUsingKeyboard
} from './helpers'

function PreviewModal(props) {
  if (!props.selectedTemplate) {
    return null
  }

  let modalProps = {
    isOpen: props.isPreviewModalOpen,
    handleClose: () => props.setPreviewModalOpen(false),
    menuRenderer: () => (
      <PreviewModalMenu
        selectedTemplate={props.selectedTemplate}
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
      imgSrc: props.selectedTemplate.file.preview_url
    }
  } else {
    modalProps = {
      ...modalProps,
      showPreviousButton: true,
      onPreviousButtonClick: () => {
        const previous = selectPreviousTemplate(
          props.templates,
          props.selectedTemplate,
          props.medium
        )

        if (previous) {
          props.setSelectedTemplate(previous)
        }
      },
      showNextButton: true,
      onNextButtonClick: () => {
        const next = selectNextTemplate(
          props.templates,
          props.selectedTemplate,
          props.medium
        )

        if (next) {
          props.setSelectedTemplate(next)
        }
      },
      handleKeyDown: e =>
        navigateBetweenTemplatesUsingKeyboard(
          e.key,
          props.templates,
          props.selectedTemplate,
          props.medium
        ),
      imgSrc: `${props.selectedTemplate.url}/preview.png`,
      imgSrcTiny: `${props.selectedTemplate.url}/thumbnail.png`
    }
  }

  return <ImagePreviewModal {...modalProps} />
}

export default PreviewModal
