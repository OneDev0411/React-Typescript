import React, { ComponentProps } from 'react'

import { ImageOrVideoPreviewModal } from 'components/ImageOrVideoPreviewModal'
import { PdfViewerModal } from 'components/PdfViewer/Modal'
import { getFileType } from 'utils/file-utils/get-file-type'
import {
  getTemplateImageOrVideo,
  isVideoThumb,
  navigateBetweenTemplatesUsingKeyboard,
  selectNextTemplate,
  selectPreviousTemplate
} from 'utils/marketing-center/helpers'

interface Props {
  isOpen: boolean
  selectedTemplate:
    | IBrandMarketingTemplate
    | IMarketingTemplateInstance
    | IBrandAsset
  setSelectedTemplate: (
    template: IBrandMarketingTemplate | IMarketingTemplateInstance | IBrandAsset
  ) => void
  type: string // can be improved
  medium?: IMarketingTemplateMedium
  templates?: (
    | IBrandMarketingTemplate
    | IMarketingTemplateInstance
    | IBrandAsset
  )[]
  actions?: React.ReactNode
  onClose?: () => void
}

function PreviewModal(props: Props) {
  const { selectedTemplate, templates, medium } = props

  if (!selectedTemplate) {
    return null
  }

  const { thumbnail: imgSrcTiny, original: imgSrc } =
    getTemplateImageOrVideo(selectedTemplate)

  let modalProps: ComponentProps<typeof ImageOrVideoPreviewModal> = {
    isOpen: props.isOpen,
    handleClose: () => props.onClose && props.onClose(),
    menuRenderer: () => props.actions,
    isVideo: isVideoThumb(selectedTemplate)
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
    (selectedTemplate.type === 'template_instance' &&
      getFileType(selectedTemplate.file) === 'pdf') ||
    (selectedTemplate.type === 'brand_asset' &&
      getFileType(selectedTemplate.file) === 'pdf')
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

  return <ImageOrVideoPreviewModal {...modalProps} />
}

export default PreviewModal
