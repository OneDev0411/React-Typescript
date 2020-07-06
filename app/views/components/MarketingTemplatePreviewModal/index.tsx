import React, { ComponentProps } from 'react'
import { connect } from 'react-redux'

import { ImagePreviewModal } from 'components/ImagePreviewModal'
import {
  getTemplateImage,
  navigateBetweenTemplatesUsingKeyboard,
  selectNextTemplate,
  selectPreviousTemplate
} from 'utils/marketing-center/helpers'

import { IAppState } from 'reducers/index'
import { PdfViewerModal } from 'components/PdfViewer/Modal'

interface Props {
  isOpen: boolean
  selectedTemplate: IMarketingTemplate | IMarketingTemplateInstance
  setSelectedTemplate: (
    template: IMarketingTemplate | IMarketingTemplateInstance
  ) => void
  type: string // can be improved
  medium?: string // can be improved
  templates?: (IMarketingTemplate | IMarketingTemplateInstance)[]
  actions?: React.ReactNode
  onClose?: () => void
}

interface StateProps {
  user: IUser
}

function PreviewModal(props: Props & StateProps) {
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
    (selectedTemplate as IMarketingTemplateInstance)?.file?.mime ===
    'application/pdf'
  ) {
    return (
      <PdfViewerModal
        isOpen
        title="Preview"
        url={(selectedTemplate as IMarketingTemplateInstance)?.file?.url}
        onClose={props?.onClose}
        {...modalProps}
      />
    )
  }

  return <ImagePreviewModal {...modalProps} />
}

export default connect<StateProps>(({ user }: IAppState) => ({ user }))(
  PreviewModal
)
