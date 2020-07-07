import React, { ComponentProps } from 'react'

import {
  getTemplateImage,
  navigateBetweenTemplatesUsingKeyboard,
  selectNextTemplate,
  selectPreviousTemplate
} from 'utils/marketing-center/helpers'

import { ImagePreviewModal } from 'components/ImagePreviewModal'
import { PdfViewerModal } from 'components/PdfViewer/Modal'

interface Props {
  isOpen: boolean
  selectedTemplate: IBrandMarketingTemplate | IMarketingTemplateInstance
  setSelectedTemplate: (
    template: IBrandMarketingTemplate | IMarketingTemplateInstance
  ) => void
  type: string // can be improved
  medium?: MarketingTemplateMedium
  templates?: (IBrandMarketingTemplate | IMarketingTemplateInstance)[]
  actions?: React.ReactNode
  onClose?: () => void
}

function PreviewModal(props: Props) {
  const { selectedTemplate, templates, medium } = props

  if (!selectedTemplate) {
    return null
  }

  const { thumbnail: imgSrcTiny, original: imgSrc } = getTemplateImage(
    selectedTemplate
  )

  let modalProps: ComponentProps<typeof ImagePreviewModal> = {
    isOpen: props.isOpen,
    handleClose: () => props.onClose && props.onClose(),
    menuRenderer: () => props.actions
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

  if (!props.isOpen) {
    return null
  }

  if (
    selectedTemplate.type === 'template_instance' &&
    selectedTemplate.file.mime === 'application/pdf'
  ) {
    return (
      <PdfViewerModal
        isOpen
        title="Preview"
        url={selectedTemplate.file.url}
        onClose={props?.onClose}
        {...modalProps}
      />
    )
  }

  return <ImagePreviewModal {...modalProps} />
}

export default PreviewModal
